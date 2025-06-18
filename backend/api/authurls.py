from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('logout/', views.logout, name='user-logout'),
    path('refresh-token/', views.refresh_token, name='refresh-token'),
    
    # User profile
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('change-password/', views.change_password, name='change-password'),
    
    # User management
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<uuid:user_id>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/<uuid:user_id>/delete/', views.UserDeleteView.as_view(), name='user-delete'),
]