import type { SketchDetail } from "../../types/app";

export const validateSketchStep = (
  values: SketchDetail,
  fieldsToValidate: (keyof SketchDetail)[]
) => {
  const errors: SketchDetail = {
    width: "",
    height: "",
    frame: "",
    company_id: "",
    subtype_id: "",
    profile_id: "",
    subtype_requirements: "",
    glassrequirement_id: "",
    accessoriesrequirement_id: "",
    sketch_id:"",
    quotation_id:""
  };

  for (const field of fieldsToValidate) {
    const value = values[field];

    switch (field) {
      case "width":
        if (!value || typeof value !== "string" || !value.trim()) {
          errors.width = "Width is required";
        } else if (Number(value) < 0.2) {
          errors.width = "Width must be higher than 0.2";
        }
        break;

      case "height":
        if (!value || typeof value !== "string" || !value.trim()) {
          errors.height = "Height is required";
        } else if (Number(value) < 0.2) {
          errors.height = "Height must be higher than 0.2";
        }
        break;

      case "frame":
        if (!value || typeof value !== "string" || !value.trim()) {
          errors.frame = "Frame is required";
        }
        break;

      case "glassrequirement_id":
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          errors.glassrequirement_id = "Company is required";
        }
        break;

      case "accessoriesrequirement_id":
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          errors.accessoriesrequirement_id = "Company is required";
        }
        break;

      case "company_id":
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          errors.company_id = "Company is required";
        }
        break;

      case "profile_id":
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          errors.profile_id = "Profile is required";
        }
        break;
    }
  }

  const isValid = fieldsToValidate.every((field) => !errors[field]);

  return { errors, isValid };
};
