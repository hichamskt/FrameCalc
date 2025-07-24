from django.urls import path
from rest_framework import serializers
from .views import (
    user,
    company,
    category,
    material,
    profile,
    profilealuminum,
    structuretype,
    structuresubtype,
    Subtype_requirement,
    SubtypeGlasseRequirement,
    subtype_accessories_requirement,
    AluminumRequirementItem,
    GlasseRequirementItem,
    AccessoriesRequirementItem,
    Sketch,
    Quotation,
    cutting,
    comments,
    post,
    NotificationView
)


urlpatterns = [
    # Authentication
    path('register/', user.UserRegistrationView.as_view(), name='user-register'),
    path('login/', user.UserLoginView.as_view(), name='user-login'),
    path('logout/', user.logout, name='user-logout'),
    path('refresh-token/', user.refresh_token, name='refresh-token'),
    
    # User profile
    path('profile/', user.UserProfileView.as_view(), name='user-profile'),
    path('change-password/', user.change_password, name='change-password'),
    path('profile/delete-image/', user.delete_profile_image, name='delete-profile-image'),
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



    # Get companies by subtype ID (URL parameter)
    path('subtypes/<int:subtype_id>/companies/', Subtype_requirement.CompanyBySubtypeView.as_view(), 
         name='companies-by-subtype'),
    
    # Get companies with detailed profile requirements for a subtype
    path('subtypes/<int:subtype_id>/companies/detailed/', 
         Subtype_requirement.CompanyBySubtypeDetailView.as_view(), 
         name='companies-by-subtype-detailed'),

   path('subtypes/<int:subtype_id>/companies/<int:company_id>/profiles/', 
         profilealuminum.ProfileBySubtypeAndCompanyView.as_view(), 
         name='profiles-by-subtype-company'),
    
    # Get profiles with detailed requirements by subtype ID and company ID
    path('subtypes/<int:subtype_id>/companies/<int:company_id>/profiles/detailed/', 
         profilealuminum.ProfileBySubtypeAndCompanyDetailView.as_view(), 
         name='profiles-by-subtype-company-detailed'),
    
    
    # Get all companies with optional subtype filtering via query parameter
    # Usage: /companies/?subtype_id=1
    path('companies/', 
         Subtype_requirement.CompanyListView.as_view(), 
         name='companies-list'),
    
    # Subtype-specific requirements
    path('structure-subtypes/<int:subtype_id>/requirements/', Subtype_requirement.SubtypeRequirementsView.as_view(), name='subtype-requirements'),
    
    # Profile-specific requirements
    path('profiles/<int:profile_id>/subtype-requirements/',Subtype_requirement.ProfileSubtypeRequirementsView.as_view(), name='profile-subtype-requirements'),

# SubtypeGlasseRequirement

     path('glass-requirements/', SubtypeGlasseRequirement.SubtypeGlasseRequirementListCreateView.as_view(), name='glass-requirement-list'),
    path('glass-requirements/<int:glassrequirement_id>/', SubtypeGlasseRequirement.SubtypeGlasseRequirementDetailView.as_view(), name='glass-requirement-detail'),
    
    path('structure-subtypes/<int:subtype_id>/glass-requirements/',SubtypeGlasseRequirement.SubtypeGlassRequirementsView.as_view(),name='subtype-glass-requirements'),
    path('companies/<int:company_id>/glass-supplies/', SubtypeGlasseRequirement.CompanyGlassSuppliesView.as_view(), name='company-glass-supplies'),
# SubtypeAccessories-requirements

    path('accessories-requirements/', subtype_accessories_requirement.SubtypeAccessoriesRequirementListCreateView.as_view(),name='accessories-requirement-list'),
    path('accessories-requirements/<int:accessoriesrequirement_id>/', subtype_accessories_requirement.SubtypeAccessoriesRequirementDetailView.as_view(),name='accessories-requirement-detail'),
    
    path('structure-subtypes/<int:subtype_id>/accessories-requirements/', subtype_accessories_requirement.SubtypeAccessoriesRequirementsView.as_view(),name='subtype-accessories-requirements'),
    path('companies/<int:company_id>/accessories-supplies/', subtype_accessories_requirement.CompanyAccessoriesSuppliesView.as_view(),name='company-accessories-supplies'),

# AluminumRequirementItem

  path('aluminum-requirement-items/',AluminumRequirementItem.AluminumRequirementItemListCreateView.as_view(), name='aluminum-item-list'),
  path('aluminum-requirement-items/<int:req_item_id>/', AluminumRequirementItem.AluminumRequirementItemDetailView.as_view(), name='aluminum-item-detail'),
    
  
  path('requirements/<int:requirement_id>/aluminum-items/', AluminumRequirementItem.RequirementAluminumItemsView.as_view(), name='requirement-aluminum-items'),
  path('aluminum-requirement-items/bulk/',AluminumRequirementItem.BulkAluminumRequirementItemCreateView.as_view(), name='bulk-aluminum-items-create'),
    

  # GlassRequirementItem
  path('glass-requirement-items/', GlasseRequirementItem.GlassRequirementItemListCreateView.as_view(), name='glass-item-list'),
    path( 'glass-requirement-items/<int:glasse_item_id>/',  GlasseRequirementItem.GlassRequirementItemDetailView.as_view(),  name='glass-item-detail' ),
   path( 'requirements/<int:requirement_id>/glass-items/', GlasseRequirementItem.RequirementGlassItemsView.as_view(),  name='requirement-glass-items' ),
    path('glass-requirement-items/bulk/',GlasseRequirementItem.BulkGlassRequirementItemCreateView.as_view(), name='bulk-glass-items-create'),
  path('requirements/<int:requirement_id>/glass-companies/', GlasseRequirementItem.GlassRequirementCompaniesView.as_view(), name='requirement-glass-companies'),
   path('companies/<int:company_id>/glass-requirements/', GlasseRequirementItem.CompanyGlassRequirementsView.as_view(), name='company-glass-requirements'),
    path('companies/<int:company_id>/requirements/<int:requirement_id>/glass-items/',GlasseRequirementItem.CompanyGlassRequirementItemsView.as_view(),name='company-requirement-glass-items' ),
    
    
    # accessories-requirement-items

    path('accessories-requirement-items/', AccessoriesRequirementItem.AccessoriesRequirementItemListCreateView.as_view(),  name='accessories-item-list' ),
    path('accessories-requirement-items/<int:req_item_id>/', AccessoriesRequirementItem.AccessoriesRequirementItemDetailView.as_view(), name='accessories-item-detail' ),
    
   
    path('requirements/<int:requirement_id>/accessories-items/', AccessoriesRequirementItem.RequirementAccessoriesItemsView.as_view(), name='requirement-accessories-items' ),
    
    
    path( 'accessories-requirement-items/bulk/', AccessoriesRequirementItem.BulkAccessoriesRequirementItemCreateView.as_view(), name='bulk-accessories-items-create' ),

     path('requirements/<int:requirement_id>/companies/<int:company_id>/accessories-items/',AccessoriesRequirementItem.CompanyAccessoriesRequirementItemsView.as_view(),name='company-requirement-accessories-items'
    ),

    # Sketch
    path('sketches/', Sketch.SketchListCreateView.as_view(), name='sketch-list'),
    path('sketches/<int:sketch_id>/', Sketch.SketchDetailView.as_view(), name='sketch-detail'),
    path('users/<uuid:user_id>/sketches/', Sketch.UserSketchesView.as_view(), name='user-sketches'),
     path("sketches/user/<uuid:user_id>/thumbnails/", Sketch.PaginatedUserSketchesView.as_view(), name="user-sketch-thumbnails"),
  
      path('sketches/<int:sketch_id>/quotation/pdf/', 
         Quotation.GenerateQuotationPDFBySketchView.as_view(), 
         name='generate_quotation_pdf_by_sketch'),
    
    path('sketches/<int:sketch_id>/quotation/pdf/base64/', 
         Quotation.GetQuotationPDFBase64BySketchView.as_view(), 
         name='get_quotation_pdf_base64_by_sketch'),
    #quotation


    path('quotations/', Quotation.QuotationListCreateView.as_view(), name='quotation-list-create'),
     path('quotations/<int:quotation_id>/', Quotation.QuotationDetailView.as_view(), name='quotation-detail'),

     path('quotations/<int:quotation_id>/pdf/', Quotation.generate_quotation_pdf, name='generate-quotation-pdf'),
    path('quotations/<int:quotation_id>/pdf/base64/', Quotation.get_quotation_pdf_base64, name='get-quotation-pdf-base64'),

        path('quotations/bulk-delete/', Quotation.bulk_delete_quotations, name='bulk-delete-quotations'),

    
    # Item update URLs
    path('quotations/material-items/<int:item_id>/', Quotation.QuotationMaterialItemUpdateView.as_view(), name='quotation-material-item-update'),
    path('quotations/aluminum-items/<int:item_id>/', Quotation.QuotationAluminumItemUpdateView.as_view(), name='quotation-aluminum-item-update'),
     path('sketches/without-quotations/', 
         Quotation.delete_sketches_without_quotations, 
         name='list_sketches_without_quotations'),

path('quotations/filter/', Quotation.QuotationFilterView.as_view(), name='quotation-filter'),
    
    # Quotation calculation
    path('quotations/create/', Quotation.create_quotation_with_calculation, name='quotation-create-with-calculation'),
     path('quotations/<int:quotation_id>/recalculate/', Quotation.recalculate_quotation, name='quotation-recalculate'),
    
    # Helper endpoints
    path('subtypes/<int:subtype_id>/requirements/', Quotation.get_requirements_for_subtype, name='subtype-requirements'),
     path('user/sketches/', Quotation.user_sketches, name='user-sketches'),


  path('quotation-material-items/<int:item_id>/', Quotation.QuotationMaterialItemUpdateView.as_view(), name='update-material-item'),
path('quotation-aluminum-items/<int:item_id>/', Quotation.QuotationAluminumItemUpdateView.as_view(), name='update-aluminum-item'),


 path('optimize-cut/', cutting.optimize_alucobond_cut, name='optimize_cut'),
    path('download/<str:filename>/', cutting.download_cut_file, name='download_cut_file'),




    path('posts/<int:post_id>/like/', post.ToggleLikeView.as_view(), name='toggle-like'),
    path('posts/<int:post_id>/comments/', comments.CommentListCreateView.as_view(), name='comments'),


     path('posts/', post.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', post.PostDetailView.as_view(), name='post-detail'),
    path('comments/<int:pk>/delete/', post.CommentDeleteView.as_view(), name='comment-delete'),
    path('posts/<int:post_id>/likes-count/', post.PostLikesCountView.as_view(), name='likes-count'),

        path('users/<uuid:user_id>/posts/', post.UserPostsView.as_view(), name='user-posts'),
        path('posts/<int:post_id>/likes/', post.PostLikesView.as_view(), name='post-likes'),
        


     path('notifications/', NotificationView.NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', NotificationView.MarkNotificationReadView.as_view(), name='mark-notification-read'),

]

