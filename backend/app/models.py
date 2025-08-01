from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Product(models.Model):
    uploader= models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
    product_name= models.CharField(max_length=50, null=False, blank=False)
    price = models.DecimalField(null=False, blank=False, decimal_places=2, max_digits=10)
    product_image = models.ImageField(upload_to="product_image/")
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.product_name
    
class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="comments")
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.comment  

# class Like(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="products")
#     liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
#     like = models.BooleanField(default=False)
#     def __str__(self):
#         return super.like