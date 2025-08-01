from django.shortcuts import render
from . models import *
from . serializers import *
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
class UserView(APIView):
    def get(self, request):
        try:
            user = User.objects.all()
        except User.DoesNotExist:
            return Response({"message":"No user found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)
    

class ProductView(APIView):
    def get(self, request, uploader=None,pk=None):
        try:
            product = Product.objects.all()
            serializer = ProductSerializer(product, many=True)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"error":"Product are empty"}, status=status.HTTP_404_NOT_FOUND)    
        
    
    def post(self, request):
        data = request.data.copy()
        print(data)
        print(request.FILES)
        
        if not request.user.is_authenticated:
            return Response({"error":"Authentication required"}, status=status.HTTP_403_FORBIDDEN)
        if not request.user.is_staff:
            return Response({"error": "Staff privileges required"}, status=status.HTTP_403_FORBIDDEN)
        serializer = ProductSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            serializer.save(uploader= request.user)
            return Response({"success":"Product created successfully"}, status=status.HTTP_201_CREATED)
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk, uploader):
        try:
            product = Product.objects.get(pk=pk, uploader__username = uploader)
        except Product.DoesNotExist:
            return Response({"error":"Failed to update"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(product)
        
        if product.uploader != request.user and not request.user.is_staff():
            return Response({"Permission denied":""}, status=status.HTTP_403_FORBIDDEN)
        
        data =request.data
        serializer = ProductSerializer(product,data=data, partial=True)
        
        if serializer.is_valid() and uploader or request.user.is_staff():
            serializer.save()
            return Response({"success": "Product updated successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
    
    def delete(self,request, uploader,pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"message":"Item not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if product.uploader == request.user or request.user.is_staff():
            product.delete()
            return Response({"success":"Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"Permission denied":""}, status=status.HTTP_403_FORBIDDEN)


class CommentView(APIView):
    def get(self, request, pk):
        comment = Comment.objects.filter(product_id=pk)
        serializer = CommentSerializer(comment, many=True)
        return Response({"success":"Success fetch comment", "data":serializer.data},status=status.HTTP_200_OK )
    
    def post(self, request):
        data = request.data
        print(data)
        if not request.user.is_authenticated:
            return Response({"error":"Authentication required"}, status=status.HTTP_403_FORBIDDEN)
        product_id = data.get('product')
        if not product_id:
            return Response({"error":"Product Id required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
        comment_data ={
            'comment':data.get('comment'),
            'product': product_id,
            'commenter': request.user.id
        }    
            
        serializer = CommentSerializer(data=comment_data) 
        if serializer.is_valid():
            serializer.save()
            return Response({"success":"Comment added successfully", 'comment':serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
        

# class LikeView(APIView):
#     def post(self, request, pk):
#         data = request.data
#         product = Product.objects.filter(product_id=pk)
#         product_id = data.get("product")
#         if not request.user.is_authenticated():
#             return Response({"permission":"An Authorised"}, status=status.HTTP_401_UNAUTHORIZED)
#         like_data = {
#             'liker':request.user,
#             'like':data.get['like'],
#             'product':product_id
#         }
#         serializer = LikeSerializer(data=like_data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"success":"Like added"},status=status.HTTP_201_CREATED)
#         return  Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
                      
            
        
     
