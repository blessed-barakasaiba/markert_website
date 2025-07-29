from django.urls import path,include
from . views import *

urlpatterns = [
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("auth/", include("allauth.urls")),
    path("users/", UserView.as_view()),
    path("products/", ProductView.as_view(),),
    path("post_products/", ProductView.as_view(),),
    path("update_products/<str:uploader>/<int:pk>/", ProductView.as_view(),),
    path("delete_products/<str:uploader>/<int:pk>/", ProductView.as_view(),),
    path("addcomment/", CommentView.as_view(),)
]
