from django.urls import path
from .views import user
from .views import company
from .views import category
from .views import material
from .views import profile
from .views import profilealuminum
from .views import structuretype
from .views import structuresubtype
from .views import Subtype_requirement

urlpatterns = [
    # Authentication
    path('register/', user.UserRegistrationView.as_view(), name='user-register'),
    path('login/', user.UserLoginView.as_view(), name='user-login'),
    path('logout/', user.logout, name='user-logout'),
    path('refresh-token/', user.refresh_token, name='refresh-token'),
    
    # User profile
    path('profile/', user.UserProfileView.as_view(), name='user-profile'),
    path('change-password/', user.change_password, name='change-password'),
    
    # User management
    path('users/', user.UserListView.as_view(), name='user-list'),
    path('users/<uuid:user_id>/', user.UserDetailView.as_view(), name='user-detail'),
    path('users/<uuid:user_id>/delete/', user.UserDeleteView.as_view(), name='user-delete'),


    # Supply managment 
     path('supply-types/', user.supply_type_list, name='supply-type-list'),
    path('supply-types/<int:pk>/', user.supply_type_detail, name='supply-type-detail'),

     # companies managment 
    path('companies/', company.CompanyListCreateView.as_view(), name='company-list-create'),
    path('companies/<int:company_id>/', company.CompanyRetrieveUpdateDestroyView.as_view(),  name='company-retrieve-update-destroy'),
    path('my-company/', company.MyCompanyView.as_view(), name='my-company'),
    path('companies/by-supply-type/<int:supply_type_id>/', company.CompaniesBySupplyTypeView.as_view(),  name='companies-by-supply-type'),
    path('allcompanies/', company.CompanyListView.as_view(), name='company-list'),
    path('companies/search/', company.CompanySearchView.as_view(), name='company-search'),

     # category 
    path('categories/', category.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:category_id>/', category.CategoryRetrieveUpdateDestroyView.as_view(), name='category-retrieve-update-destroy'),
    path('public/categories/',category.PublicCategoryListView.as_view(), name='public-category-list'),

    # materials 
    path('materials/', material.MaterialListCreateView.as_view(), name='material-list-create'),
    path('materials/<int:material_id>/', material.MaterialRetrieveUpdateDestroyView.as_view(),name='material-retrieve-update-destroy'),
     path('companies/<int:company_id>/materials/', material.CompanyMaterialsView.as_view(),  name='company-materials'),
     path('public/companies/<int:company_id>/materials/',material.PublicCompanyMaterialsView.as_view(), name='public-company-materials'),
     path('companies/<int:company_id>/materials/filter/',material.CompanyMaterialsFilterView.as_view(), name='company-materials-filter'),
      path('public/companies/<int:company_id>/materialsfilter/', material.PublicCompanyMaterialsFilterView.as_view(), name='public-company-materials'),
      

    #profiles

    path('profiles/', profile.ProfileListCreateView.as_view(), name='profile-list-create'),
    path('profiles/<int:profile_id>/', profile.ProfileRetrieveUpdateDestroyView.as_view(),  name='profile-retrieve-update-destroy'),
    path('companies/<int:company_id>/profiles/', profile.PublicProfilesView.as_view(), name='company-profiles'),
    path('profiles/with-company/', profile.AllProfilesWithCompanyView.as_view(), name='all-profiles-with-company'),

    #ProfileAluminum

    path('profile-aluminums/',profilealuminum.ProfileAluminumListCreateView.as_view(), name='profile-aluminum-list-create'),
    path('profile-aluminums/<int:profile_material_id>/', profilealuminum.ProfileAluminumRetrieveUpdateDestroyView.as_view(), name='profile-aluminum-retrieve-update-destroy'),
    path('profiles/<int:profile_id>/aluminums/', profilealuminum.ProfileAluminumByProfileView.as_view(), name='profile-aluminums-by-profile'),
    path('public/profiles/<int:profile_id>/aluminums/', profilealuminum.PublicProfileAluminumByProfileView.as_view(), name='public-profile-aluminums'),


    #StructureType


    path('structure-types/', structuretype.StructureTypeListView.as_view(), name='structure-type-list'),
    path('structure-types/<int:type_id>/', structuretype.StructureTypeDetailView.as_view(), name='structure-type-detail'),

    #structure-subtypes

    path('structure-subtypes/', structuresubtype.StructureSubTypeListCreateView.as_view(),name='structure-subtype-list'),
    path('structure-subtypes/<int:subtype_id>/', structuresubtype.StructureSubTypeDetailView.as_view(),name='structure-subtype-detail'),
    path('structure-types/<int:type_id>/subtypes/',structuresubtype.StructureSubTypeByTypeView.as_view(),name='structure-subtypes-by-type'),


    #SubtypeRequirement
    path('subtype-requirements/',Subtype_requirement.SubtypeRequirementListCreateView.as_view(), name='subtype-requirement-list'),
    path('subtype-requirements/<int:requirement_id>/',  Subtype_requirement.SubtypeRequirementDetailView.as_view(),name='subtype-requirement-detail'),
    
    # Subtype-specific requirements
    path('structure-subtypes/<int:subtype_id>/requirements/', Subtype_requirement.SubtypeRequirementsView.as_view(), name='subtype-requirements'),
    
    # Profile-specific requirements
    path('profiles/<int:profile_id>/subtype-requirements/',Subtype_requirement.ProfileSubtypeRequirementsView.as_view(), name='profile-subtype-requirements'),
]