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
  ![Image](https://github.com/user-attachments/assets/1c4c8ab6-bb28-406b-bd09-00a992f0bf92)

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

---

### 🪵 Aluminum Requirement Item Management

| Method | Endpoint                                                                                      | Description                                                           |
|--------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| GET    | `/aluminum-requirement-items/`                                                                | List all aluminum requirement items                                   |
| POST   | `/aluminum-requirement-items/`                                                                | Create a new aluminum requirement item                                |
| GET    | `/aluminum-requirement-items/<int:req_item_id>/`                                              | Retrieve a specific aluminum requirement item                         |
| PUT    | `/aluminum-requirement-items/<int:req_item_id>/`                                              | Update a specific aluminum requirement item                           |
| DELETE | `/aluminum-requirement-items/<int:req_item_id>/`                                              | Delete a specific aluminum requirement item                           |
| GET    | `/requirements/<int:requirement_id>/aluminum-items/`                                          | Get all aluminum items linked to a specific requirement               |
| POST   | `/aluminum-requirement-items/bulk/`                                                           | Bulk create multiple aluminum requirement items                       |

--- 

### 🪟 Glass Requirement Item Management

| Method | Endpoint                                                                                             | Description                                                            |
|--------|------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| GET    | `/glass-requirement-items/`                                                                          | List all glass requirement items                                       |
| POST   | `/glass-requirement-items/`                                                                          | Create a new glass requirement item                                    |
| GET    | `/glass-requirement-items/<int:glasse_item_id>/`                                                     | Retrieve a specific glass requirement item                             |
| PUT    | `/glass-requirement-items/<int:glasse_item_id>/`                                                     | Update a specific glass requirement item                               |
| DELETE | `/glass-requirement-items/<int:glasse_item_id>/`                                                     | Delete a specific glass requirement item                               |
| GET    | `/requirements/<int:requirement_id>/glass-items/`                                                    | Get all glass items linked to a specific requirement                   |
| POST   | `/glass-requirement-items/bulk/`                                                                      | Bulk create multiple glass requirement items                           |
| GET    | `/requirements/<int:requirement_id>/glass-companies/`                                                | Get companies associated with a specific requirement's glass items     |
| GET    | `/companies/<int:company_id>/glass-requirements/`                                                    | List all glass requirements associated with a specific company         |
| GET    | `/companies/<int:company_id>/requirements/<int:requirement_id>/glass-items/`                         | Get all glass items of a company for a specific requirement            |


---

### 🧰 Accessories Requirement Item Management

| Method | Endpoint                                                                                                     | Description                                                                    |
|--------|--------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| GET    | `/accessories-requirement-items/`                                                                            | List all accessories requirement items                                         |
| POST   | `/accessories-requirement-items/`                                                                            | Create a new accessories requirement item                                      |
| GET    | `/accessories-requirement-items/<int:req_item_id>/`                                                          | Retrieve a specific accessories requirement item                               |
| PUT    | `/accessories-requirement-items/<int:req_item_id>/`                                                          | Update a specific accessories requirement item                                 |
| DELETE | `/accessories-requirement-items/<int:req_item_id>/`                                                          | Delete a specific accessories requirement item                                 |
| GET    | `/requirements/<int:requirement_id>/accessories-items/`                                                      | Get all accessories items linked to a specific requirement                     |
| POST   | `/accessories-requirement-items/bulk/`                                                                       | Bulk create multiple accessories requirement items                             |
| GET    | `/requirements/<int:requirement_id>/companies/<int:company_id>/accessories-items/`                          | Get company-specific accessories items for a given requirement                 |

---

### ✏️ Sketch Management

| Method | Endpoint                                      | Description                                     |
|--------|-----------------------------------------------|-------------------------------------------------|
| GET    | `/sketches/`                                  | List all sketches                               |
| POST   | `/sketches/`                                  | Create a new sketch                             |
| GET    | `/sketches/<int:sketch_id>/`                  | Retrieve a specific sketch by its ID            |
| PUT    | `/sketches/<int:sketch_id>/`                  | Update a specific sketch                        |
| DELETE | `/sketches/<int:sketch_id>/`                  | Delete a specific sketch                        |
| GET    | `/users/<uuid:user_id>/sketches/`             | List all sketches created by a specific user    |


---

## 📄 Quotation APIs

### 🔧 Quotation CRUD

| Method | Endpoint                               | Description                         |
|--------|----------------------------------------|-------------------------------------|
| GET    | `/api/quotations/`                     | List all quotations                 |
| POST   | `/api/quotations/`                     | Create a new quotation              |
| GET    | `/api/quotations/<quotation_id>/`      | Retrieve details of a quotation     |

---

### 🔄 Quotation 

| Method | Endpoint                                             | Description                           |
|--------|------------------------------------------------------|---------------------------------------|
| POST   | `/api/quotations/create/`                            | Create a quotation with calculation   |
| POST   | `/api/quotations/<quotation_id>/recalculate/`        | Recalculate an existing quotation     |
|--------|-----------------------------------------------------------------|----------------------------------------|
| PUT    | `/api/quotation-material-items/<item_id>/`                      | Update a specific material item        |
| PUT    | `/api/quotation-aluminum-items/<item_id>/`                      | Update a specific aluminum item        |
| Method | Endpoint                                          | Description                             |
|--------|---------------------------------------------------|-----------------------------------------|
| GET    | `/api/subtypes/<subtype_id>/requirements/`        | Get requirements for a given subtype    |
| GET    | `/api/user/sketches/`                             | List all sketches belonging to the user |

## ✂️ Alucobond Cutting Optimization API

| Method | Endpoint             | Description                                     |
|--------|----------------------|-------------------------------------------------|
| POST   | `/api/optimize-cut/` | Optimize cutting layout to reduce material waste |

**Description**:  
This endpoint takes a defined Alucobond sheet size and a list of required piece dimensions, and returns the most efficient cutting strategy to minimize waste.

**Example Payload**:
```json
{
  "sheet_width": 3000,
  "sheet_height": 1500,
  "pieces": [
    { "width": 500, "height": 1000, "quantity": 4 },
    { "width": 1000, "height": 500, "quantity": 2 }
  ]
}
```

# Project Dependencies

This Django backend project for Alucobond sheet cutting optimization uses the following main libraries:

| Library      | Purpose                                                                                             | Link                                                                                 |
|--------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| **Django**   | High-level Python web framework used to build the backend API and serve endpoints                 | [https://www.djangoproject.com/](https://www.djangoproject.com/)                     |
| **rectpack** | Efficient 2D bin packing algorithm used to optimally arrange rectangular pieces on the sheet     | [https://github.com/secnot/rectpack](https://github.com/secnot/rectpack)             |
| **svgwrite** | Library to programmatically generate SVG images representing the cutting layouts                  | [https://github.com/mozman/svgwrite](https://github.com/mozman/svgwrite)             |
| **cairosvg** | Converts SVG files to PDF format, enabling PDF downloads of cutting layouts                       | [https://github.com/Kozea/CairoSVG](https://github.com/Kozea/CairoSVG)                |

---

## System Dependencies for `cairosvg`

`cairosvg` requires native Cairo graphics libraries installed on your system.

- **On Linux (Ubuntu/Debian):**

  ```bash
  sudo apt-get update
  sudo apt-get install libcairo2 libpango1.0-0 libgdk-pixbuf2.0-0
  
  ```


  # Model Training

This project uses a custom YOLO-based object detection model to detect handwritten dimensions labeled with prefixes **`w`** (width) and **`h`** (height) on images of sketches.

## Dataset

- Synthetic dataset generated with images containing handwritten numbers prefixed by `w` and `h`.
- Each image is annotated in YOLO format:
  - Class `0` for width (`wXXX`)
  - Class `1` for height (`hXXX`)

## Training Setup

1. **Install dependencies**:

```bash
pip install ultralytics torch torchvision

```
2. **Organize your dataset:**:


```bash
/dataset
  /images
    /train
    /val
  /labels
    /train
    /val


```

3. **Create a data.yaml file describing dataset paths and classes**:


```bash
train: ./dataset/images/train
val: ./dataset/images/val

nc: 2
names: ['width', 'height']


```
## Train the Model
- Run training using Ultralytics YOLO:

```bash
yolo task=detect mode=train model=yolov8n.pt data=data.yaml epochs=100 imgsz=640
```
 - Training results (best weights) will be saved in:
 ```bash

 runs/detect/train/weights/best.pt

```
## Inference / Testing
After training, use your model to detect dimensions on new images:

```bash

from ultralytics import YOLO

model = YOLO('runs/detect/train/weights/best.pt')
results = model.predict(source='path/to/test_images', save=True)

```

## References

- [Ultralytics YOLO Documentation](https://docs.ultralytics.com/)
- [YOLOv8 GitHub Repository](https://github.com/ultralytics/ultralytics)
- [Generating Synthetic Handwritten Datasets](https://paperswithcode.com/task/handwriting-recognition)

---



