# FrameCalc
A web platform for scanning hand-drawn sketches of windows, doors, and roller shutters, reading handwritten dimensions, and instantly calculating required aluminum materials across multiple suppliers.
## 🖌️ Design

The visual design of **FrameCalc** was built in Figma to deliver a clean, professional, and user-friendly interface for:

- 🧍 Individuals uploading sketches and generating quotes  
- 🏢 Companies managing their aluminum, glass, or accessory materials  
- 📐 Material estimations based on shape & dimension detection  
- 🧾 Viewing and managing quotes with real-time pricing

👉 **View the full design in Figma:**  
[🔗 Figma – FrameCalc UI](https://www.figma.com/proto/cj1zzq4cszlkQf2Mu5kftw/FrameCalc?node-id=0-1&t=sqiexuvAP0MzywKA-1)



## Data Model Overview
### Entity-Relationship Diagram (ERD) 
  ![Image](https://github.com/user-attachments/assets/f06fa876-9ae1-4ad0-a497-2029dfcd0910)

## 📘 API Endpoints Documentation

---

### 🔐 Authentication & User Profile

| Method | Endpoint              | Description                             |
|--------|-----------------------|-----------------------------------------|
| POST   | `/register/`          | Register a new user                     |
| POST   | `/login/`             | Log in a user and retrieve tokens       |
| POST   | `/logout/`            | Log out the authenticated user          |
| POST   | `/refresh-token/`     | Refresh the authentication token        |



| Method | Endpoint            | Description                            |
|--------|---------------------|----------------------------------------|
| GET    | `/profile/`         | Retrieve authenticated user's profile  |
| PITCH  | `/profile/`         | Update user profile                    |
| POST   | `/change-password/` | Change password for authenticated user |

---

### 👤 User Management

| Method | Endpoint                        | Description                                                      |
|--------|----------------------------------|-----------------------------------------------------------------|
| GET    | `/users/`                       | List all the users for the superuser if not only display the user|
| GET    | `/users/<uuid:user_id>/`        | Retrieve details of a specific user                              |
| DELETE | `/users/<uuid:user_id>/delete/` | Delete a specific user                                           |

> **Note:** Authentication is required for user-specific and company-related endpoints.
---

### 📦 Supply Management

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | `/supply-types/`                  | List all supply types           |
| GET    | `/supply-types/<int:pk>/`         | Retrieve a specific supply type |
| PUT    | `/supply-types/<int:pk>/`         | Update a specific supply type   |
| DELETE    | `/supply-types/<int:pk>/`      | Delete a specific supply type   |

---

### 🏢 Company Management

| Method | Endpoint                                                  | Description                                      |
|--------|-----------------------------------------------------------|--------------------------------------------------|
| GET    | `/companies/`                                             | List all companies                               |
| POST   | `/companies/`                                             | Create a new company                             |
| GET    | `/companies/<int:company_id>/`                            | Retrieve a specific company                      |
| PUT    | `/companies/<int:company_id>/`                            | Update a specific company                        |
| DELETE | `/companies/<int:company_id>/`                            | Delete a specific company                        |
| GET    | `/my-company/`                                            | Retrieve company of the authenticated user       |
| GET    | `/companies/by-supply-type/<int:supply_type_id>/`         | List companies offering a specific supply type   |
| GET    | `/allcompanies/`                                          | Get all companies (alternative list view)        |
| GET    | `/companies/search/`                                      | Search company by name                           |

---

> ⚠️ Token-based authentication is expected for protected routes. Ensure to include the `Authorization: Bearer <token>` header.


---

### 🗂️ Category Management

| Method | Endpoint                              | Description                          |
|--------|----------------------------------------|--------------------------------------|
| GET    | `/categories/`                         | List all categories                   |
| POST   | `/categories/`                         | Create a new category                 |
| GET    | `/categories/<int:category_id>/`       | Retrieve a specific category          |
| PUT    | `/categories/<int:category_id>/`       | Update a specific category            |
| DELETE | `/categories/<int:category_id>/`       | Delete a specific category            |


---

### 🧱 Material Management

| Method | Endpoint                                                     | Description                                 |
|--------|--------------------------------------------------------------|---------------------------------------------|
| GET    | `/materials/`                                                | List all materials                          |
| POST   | `/materials/`                                                | Create a new material                       |
| GET    | `/materials/<int:material_id>/`                              | Retrieve a specific material                |
| PUT    | `/materials/<int:material_id>/`                              | Update a specific material                  |
| DELETE | `/materials/<int:material_id>/`                              | Delete a specific material                  |
| GET    | `/companies/<int:company_id>/materials/`                     | List all materials for a specific company   |
| GET    | `/companies/<int:company_id>/materials/filter/`              | Filter materials for a specific company     |


---

### 🧩 Profile Management

| Method | Endpoint                                                  | Description                                       |
|--------|-----------------------------------------------------------|---------------------------------------------------|
| GET    | `/profiles/`                                              | List all profiles                                |
| POST   | `/profiles/`                                              | Create a new profile                             |
| GET    | `/profiles/<int:profile_id>/`                             | Retrieve a specific profile                      |
| PUT    | `/profiles/<int:profile_id>/`                             | Update a specific profile                        |
| DELETE | `/profiles/<int:profile_id>/`                             | Delete a specific profile                        |
| GET    | `/companies/<int:company_id>/profiles/`                   | List all profiles for a specific company         |
| GET    | `/profiles/with-company/`                                 | List all profiles along with their company info  |

---
### 🏗️ Profile Aluminum Management

| Method | Endpoint                                                             | Description                                               |
|--------|----------------------------------------------------------------------|-----------------------------------------------------------|
| GET    | `/profile-aluminums/`                                                | List all aluminum profiles                                |
| POST   | `/profile-aluminums/`                                                | Create a new aluminum profile                             |
| GET    | `/profile-aluminums/<int:profile_material_id>/`                     | Retrieve a specific aluminum profile                      |
| PUT    | `/profile-aluminums/<int:profile_material_id>/`                     | Update a specific aluminum profile                        |
| DELETE | `/profile-aluminums/<int:profile_material_id>/`                     | Delete a specific aluminum profile                        |
| GET    | `/profiles/<int:profile_id>/aluminums/`                              | List all aluminum profiles for a specific profile         |
| GET    | `/public/profiles/<int:profile_id>/aluminums/`                       | Publicly list aluminum profiles for a specific profile    |


---

### 🏗️ Structure Type Management

| Method | Endpoint                                       | Description                                  |
|--------|------------------------------------------------|----------------------------------------------|
| GET    | `/structure-types/`                            | List all structure types                     |
| GET    | `/structure-types/<int:type_id>/`              | Retrieve a specific structure type           |
| PUT    | `/structure-types/<int:type_id>/`              | Update a specific structure type             |
| DELETE | `/structure-types/<int:type_id>/`              | Delete a specific structure type             |

---

### 🏗️ Structure SubType Management

| Method | Endpoint                                                   | Description                                         |
|--------|------------------------------------------------------------|-----------------------------------------------------|
| GET    | `/structure-subtypes/`                                     | List all structure subtypes                         |
| POST   | `/structure-subtypes/`                                     | Create a new structure subtype                      |
| GET    | `/structure-subtypes/<int:subtype_id>/`                    | Retrieve a specific structure subtype               |
| PUT    | `/structure-subtypes/<int:subtype_id>/`                    | Update a specific structure subtype                 |
| DELETE | `/structure-subtypes/<int:subtype_id>/`                    | Delete a specific structure subtype                 |
| GET    | `/structure-types/<int:type_id>/subtypes/`                 | List all subtypes under a specific structure type   |

---

### 📐 Subtype Requirement Management

| Method | Endpoint                                                              | Description                                       |
|--------|-----------------------------------------------------------------------|---------------------------------------------------|
| GET    | `/subtype-requirements/`                                              | List all subtype requirements                    |
| POST   | `/subtype-requirements/`                                              | Create a new subtype requirement                 |
| GET    | `/subtype-requirements/<int:requirement_id>/`                         | Retrieve a specific subtype requirement          |
| PUT    | `/subtype-requirements/<int:requirement_id>/`                         | Update a specific subtype requirement            |
| DELETE | `/subtype-requirements/<int:requirement_id>/`                         | Delete a specific subtype requirement            |
| GET    | `/structure-subtypes/<int:subtype_id>/requirements/`                  | List requirements related to a specific subtype  |
| GET    | `/profiles/<int:profile_id>/subtype-requirements/`                   | List requirements related to a specific profile  |

---

### 🧿 Glass Requirement Management

| Method | Endpoint                                                                      | Description                                             |
|--------|-------------------------------------------------------------------------------|---------------------------------------------------------|
| GET    | `/glass-requirements/`                                                        | List all glass requirements                             |
| POST   | `/glass-requirements/`                                                        | Create a new glass requirement                          |
| GET    | `/glass-requirements/<int:glassrequirement_id>/`                              | Retrieve a specific glass requirement                   |
| PUT    | `/glass-requirements/<int:glassrequirement_id>/`                              | Update a specific glass requirement                     |
| DELETE | `/glass-requirements/<int:glassrequirement_id>/`                              | Delete a specific glass requirement                     |
| GET    | `/structure-subtypes/<int:subtype_id>/glass-requirements/`                    | List glass requirements related to a specific subtype   |
| GET    | `/companies/<int:company_id>/glass-supplies/`                                 | List all glass supplies associated with a company       |


---

### 🧰 Accessories Requirement Management

| Method | Endpoint                                                                                  | Description                                                  |
|--------|-------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| GET    | `/accessories-requirements/`                                                              | List all accessories requirements                            |
| POST   | `/accessories-requirements/`                                                              | Create a new accessories requirement                         |
| GET    | `/accessories-requirements/<int:accessoriesrequirement_id>/`                              | Retrieve a specific accessories requirement                  |
| PUT    | `/accessories-requirements/<int:accessoriesrequirement_id>/`                              | Update a specific accessories requirement                    |
| DELETE | `/accessories-requirements/<int:accessoriesrequirement_id>/`                              | Delete a specific accessories requirement                    |
| GET    | `/structure-subtypes/<int:subtype_id>/accessories-requirements/`                          | List accessories requirements for a specific subtype         |
| GET    | `/companies/<int:company_id>/accessories-supplies/`                                       | List all accessories supplies for a specific company         |

