from django.urls import path
from . import views
from . import company_views
from . import category_views
from . import material_views
from . import profile_views
from . import profilealuminum_view
from . import structuretype_views

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

     # companies managment 
    path('companies/', company_views.CompanyListCreateView.as_view(), name='company-list-create'),
    path('companies/<int:company_id>/', company_views.CompanyRetrieveUpdateDestroyView.as_view(),  name='company-retrieve-update-destroy'),
    path('my-company/', company_views.MyCompanyView.as_view(), name='my-company'),
    path('companies/by-supply-type/<int:supply_type_id>/', company_views.CompaniesBySupplyTypeView.as_view(),  name='companies-by-supply-type'),
    path('allcompanies/', company_views.CompanyListView.as_view(), name='company-list'),
    path('companies/search/', company_views.CompanySearchView.as_view(), name='company-search'),

     # category 
    path('categories/', category_views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:category_id>/', category_views.CategoryRetrieveUpdateDestroyView.as_view(), name='category-retrieve-update-destroy'),
    path('public/categories/',category_views.PublicCategoryListView.as_view(), name='public-category-list'),

    # materials 
    path('materials/', material_views.MaterialListCreateView.as_view(), name='material-list-create'),
    path('materials/<int:material_id>/', material_views.MaterialRetrieveUpdateDestroyView.as_view(),name='material-retrieve-update-destroy'),
     path('companies/<int:company_id>/materials/', material_views.CompanyMaterialsView.as_view(),  name='company-materials'),
     path('public/companies/<int:company_id>/materials/',material_views.PublicCompanyMaterialsView.as_view(), name='public-company-materials'),
     path('companies/<int:company_id>/materials/filter/',material_views.CompanyMaterialsFilterView.as_view(), name='company-materials-filter'),
      path('public/companies/<int:company_id>/materialsfilter/', material_views.PublicCompanyMaterialsFilterView.as_view(), name='public-company-materials'),
      

    #profiles

    path('profiles/', profile_views.ProfileListCreateView.as_view(), name='profile-list-create'),
    path('profiles/<int:profile_id>/', profile_views.ProfileRetrieveUpdateDestroyView.as_view(),  name='profile-retrieve-update-destroy'),
    path('companies/<int:company_id>/profiles/', profile_views.PublicProfilesView.as_view(), name='company-profiles'),
    path('profiles/with-company/', profile_views.AllProfilesWithCompanyView.as_view(), name='all-profiles-with-company'),

    #ProfileAluminum

    path('profile-aluminums/',profilealuminum_view.ProfileAluminumListCreateView.as_view(), name='profile-aluminum-list-create'),
    path('profile-aluminums/<int:profile_material_id>/', profilealuminum_view.ProfileAluminumRetrieveUpdateDestroyView.as_view(), name='profile-aluminum-retrieve-update-destroy'),
    path('profiles/<int:profile_id>/aluminums/', profilealuminum_view.ProfileAluminumByProfileView.as_view(), name='profile-aluminums-by-profile'),
    path('public/profiles/<int:profile_id>/aluminums/', profilealuminum_view.PublicProfileAluminumByProfileView.as_view(), name='public-profile-aluminums'),


    #StructureType


    path('structure-types/', structuretype_views.StructureTypeListView.as_view(), name='structure-type-list'),
    path('structure-types/<int:type_id>/', structuretype_views.StructureTypeDetailView.as_view(), name='structure-type-detail'),
]