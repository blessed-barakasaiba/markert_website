from rest_framework import serializers
from . models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name']

class ProductSerializer(serializers.ModelSerializer):
    uploader = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ['id', 'date', 'uploader']