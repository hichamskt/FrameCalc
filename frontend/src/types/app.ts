export  type User = {
    email : string ;
    username: string ; 
    password : string ; 
    password2: string;
    profile_image?: string;
		profile_image_url?: string
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
