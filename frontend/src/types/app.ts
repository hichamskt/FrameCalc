/* eslint-disable @typescript-eslint/no-explicit-any */
export  type User = {
    email : string ;
    username: string ; 
    password : string ; 
    password2: string;
    profile_image?: string;
		profile_image_url?: string
}



export interface UserProfile {
  user_id: string;
  email: string;
  username: string;
  profile_image: string;
  profile_image_url: string;
}


type Values = Userl;
type Errors = Userl;


export type SignupInputTypes = {
  label: string;
  placeholder: string;
  name: keyof Userl;
  type: string;
  values: Values;
  setValues: React.Dispatch<React.SetStateAction<Values>>;
  errors: Errors;
};

export type InputTypes = {
  label: string;
  placeholder: string;
  name: keyof User;
  type: string;
  values: User;
  setValues: React.Dispatch<React.SetStateAction<User>>;
  errors: User;
Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};





// src/context/types.ts

export interface DecodedToken {
  exp: number;
  user_id?: string;
  sub?: string;
  email?: string;
}

export interface Userl {
    email : string ;
    password : string ; 
    
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  loading: boolean;
}

export interface SketchDetail {
    width: string;
    height: string;
    frame:string;
    subtype_id:string;
    company_id:string;
    profile_id:string;
    subtype_requirements:string;
    glassrequirement_id:string
    accessoriesrequirement_id:string,
    sketch_id:string,
    quotation_id:string,
    refrech:boolean
};

export interface NextStep  {
    nextStep: () => void;
    setSketchDetail: React.Dispatch<React.SetStateAction<SketchDetail | undefined>>;

}
export interface prevStep {
    prevStep: () => void;
   

}



export interface QuotationFilters {
  subtype?: string;
  priceMin?: number;
  priceMax?: number;
  widthMin?: number;
  widthMax?: number;
  heightMin?: number;
  heightMax?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
}

// Quotation interface (adjust based on your actual quotation structure)
export interface Quotation {
  quotation_id: any;
  id: number;
  subtype: string;
  price: number;
  width: number;
  height: number;
  date: string;
  // Add other quotation properties as needed
}

// Pagination interface
export interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
  totalResults: number;
}

// API Response interface
export interface QuotationApiResponse {
  results: Quotation[];
  count: number;
  next: string | null;
  previous: string | null;
  total_results: number;
  filters_applied: Record<string, any>;
}

// Function return type
export interface FilterQuotationsResult {
  success: boolean;
  data?: QuotationApiResponse;
  quotations: Quotation[];
  pagination: Pagination | null;
  filtersApplied?: Record<string, any>;
  error?: string;
}


interface PostUser {
  profile_image_url?:string;
  username?:string;

}



export interface Post {
  id: number;
  user: PostUser; 
  text: string;
  image: string | null;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  liked_users: string[]; 
}


export interface CreatePostData {
  text: string;
  image?: File;
}





export interface Comment {
  id: number;
  user: string;
  post: number;
  text: string;
  created_at: string;
}


export interface PaginatedCommentResponse {
  results: Comment[];
  next: string | null;
}
