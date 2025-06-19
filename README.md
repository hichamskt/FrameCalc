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
  ![Image](https://github.com/user-attachments/assets/4a7befc4-439f-4332-8d89-5d6222136280)

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

> **Note:** Authentication is required for user-specific and company-related endpoints.
