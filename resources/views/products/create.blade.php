<form action="{{ url('products') }}" method="POST">
    @csrf
    <input type="text" name="name" placeholder="Name" required>
    <textarea name="description" placeholder="Description" required></textarea>
    <button type="submit">Create Product</button>
</form>
