# return an array of numbers (that are a power of 2)
# for which the input "n" is the sum
def powers(n):
  result = []
  i = 0
  
  while n:
    if n & 1:
      result.append(2**i)
      
    n = n >> 1
    
    i += 1
  
  return result
