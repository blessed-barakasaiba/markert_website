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
            
        
     
