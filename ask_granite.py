from langchain.llms.base import LLM
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnableSequence

#from langchain.vectorstores import Chroma
from langchain_community.vectorstores import Chroma

#from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain.text_splitter import CharacterTextSplitter

#from langchain.document_loaders import TextLoader
from langchain_community.document_loaders import TextLoader

from typing import Any, List, Optional
from pydantic import Field
from ctransformers import AutoModelForCausalLM

class LocalGraniteLLM(LLM):
    model_path: str = Field(..., description="Path to the local Granite .gguf model file")
    model: Any = Field(default=None, description="Loaded Granite model")

    def __init__(self, model_path: str):
        super().__init__(model_path=model_path)
        self.load_model()

    def load_model(self):
        print(f"Loading model from {self.model_path}")
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_path,
            model_type="llama",
            gpu_layers=0  # Set to a higher number if you want to use GPU
        )

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        response = self.model(prompt, max_new_tokens=100, temperature=0.7)
        return response

    @property
    def _llm_type(self) -> str:
        return "local_granite"

# Initialize the LLM with the path to your local Granite .gguf model file
local_granite = LocalGraniteLLM(model_path="/root/model/granite-7b-lab-Q4_K_M.gguf")

# Initialize embeddings
embeddings = HuggingFaceEmbeddings()

# Initialize vector store
vectorstore = Chroma(embedding_function=embeddings, persist_directory="./chroma_db")

def add_knowledge(file_path: str):
    """Add knowledge to the vector store from a text file."""
    loader = TextLoader(file_path)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    vectorstore.add_documents(docs)
    vectorstore.persist()
    print(f"Added knowledge from {file_path}")

def retrieve_relevant_context(query: str, k: int = 2) -> str:
    """Retrieve relevant context from the vector store."""
    docs = vectorstore.similarity_search(query, k=k)
    return "\n".join([doc.page_content for doc in docs])

# Create a prompt template that includes retrieved context
prompt = PromptTemplate(
    input_variables=["context", "topic"],
    template="Context: {context}\n\nBased on the above context and your knowledge, write a short paragraph about {topic}."
)

# Create a RunnableSequence
chain = RunnableSequence(
    lambda x: {"context": retrieve_relevant_context(x["topic"]), "topic": x["topic"]},
    prompt,
    local_granite
)


def test_knowledge_addition(test_query: str):
    """Test if the added knowledge is retrievable and used in responses."""
    print(f"Testing with query: '{test_query}'")

    # Step 1: Retrieve context
    context = retrieve_relevant_context(test_query)
    print("\nRetrieved context:")
    print(context)

    # Step 2: Generate response
    result = chain.invoke({"topic": test_query})
    print("\nGenerated response:")
    print(result)

    # Step 3: Analyze
    print("\nAnalysis:")
    if any(word in result.lower() for word in context.lower().split()):
        print("The response appears to incorporate information from the added knowledge.")
    else:
        print("The response might not be using the added knowledge. Consider refining the query or adding more relevant information.")



# # Example usage
# add_knowledge("/root/model/knowledge.txt")  # Add this line to add knowledge

# # Run the chain
# result = chain.invoke({"topic": "artificial intelligence"})

# print("====================\n\n")
# print(result)


print("====================\n\n")
test_knowledge_addition("What are some applications of natural language processing?")
