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

    