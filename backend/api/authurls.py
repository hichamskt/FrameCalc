from django.urls import path
from . import views
from . import company_views


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


    # Supply managment 
     path('supply-types/', views.supply_type_list, name='supply-type-list'),
    path('supply-types/<int:pk>/', views.supply_type_detail, name='supply-type-detail'),


    path('companies/', company_views.CompanyListCreateView.as_view(), name='company-list-create'),
    path('companies/<int:company_id>/', company_views.CompanyRetrieveUpdateDestroyView.as_view(),  name='company-retrieve-update-destroy'),
    path('my-company/', company_views.MyCompanyView.as_view(), name='my-company'),
     path('companies/by-supply-type/<int:supply_type_id>/', company_views.CompaniesBySupplyTypeView.as_view(),  name='companies-by-supply-type'),
      path('allcompanies/', company_views.CompanyListView.as_view(), name='company-list'),
]