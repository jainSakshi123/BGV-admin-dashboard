import * as Yup from "yup";

export const validationLoginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
  password: Yup.string()
    .required("Please enter your password.")
    .min(8, "Password must be at least 8 character"),
});

export const CahngePasswordSchema = Yup.object({
  oldPassword: Yup.string().required("Please enter your current password."),
  newPassword: Yup.string()
    .required("Please enter your new password.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
});

export const validationForgotSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
});
export const verifyOtpSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
  otp: Yup.string()
    .matches(/^\d{6}$/, "Please enter a valid OTP.")
    .required("Please enter the OTP sent to your email."),
});
export const validationResetSchema = Yup.object({
  newPassword: Yup.string()
    .required("This field is required")
    .min(
      8,
      "Password must be 8+ characters with uppercase, lowercase, digits, and special characters"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Password do not match.")
    .required("This field is required"),
});
export const validationGetOptions = Yup.object().shape({
  newOption: Yup.string().required("Option is required"),
});

export const validationCreateServiceSchema = Yup.object().shape({
  serviceName: Yup.string().required("Service name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.string().required("Price is required"),
});

export const validationPackageEditSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  pricing: Yup.string().required("Pricing required"),
});

export const CompanyCreateValidation = Yup.object({
  companyLogo: Yup.string().required("Image is required"),
  companyName: Yup.string().required("Company Name is required"),
  companyUser: Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter your email address."),
    password: Yup.string().required("Please enter your password."),
    phone: Yup.string().required("Contact Number is required"),
  }),
});

export const CompanyUserCreateValidation = Yup.object({
  companyUser: Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter your email address."),
    password: Yup.string().required("Please enter your password."),
    phone: Yup.string().required("Contact Number is required"),
  }),
});

export const validationCreateUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(
      /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/,
      "Alphanumeric and special characters are allowed"
    )
    .required("First name is required"),

  lastName: Yup.string().required("Last name is required"),

  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    .required("Please enter your password."),

  contactNo: Yup.string()
    .matches(/^[0-9]+$/, "Contact number contain only digits")
    .min(10, "Contact number be at least 10 digits")
    .max(10, "Contact number must be at least 10 digits")
    .required("Contact Number is required"),
  // userType: Yup.string().required("userType is required"),
  // annualVolumeOfChecks: Yup.string().required("Last name is required"),
  // code: Yup.string().required("Last name is required"),
});

export const UserEditSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Contact Number is required"),
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    .required("Please enter your password."),
});
export const CompanyEditSchema = Yup.object().shape({
  companyName: Yup.string().required("Company Name is required"),
  companyLogo: Yup.string().required("Company Logo is required"),
});

export const ProfileEditSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  contactNo: Yup.string()
    .matches(/^\d{10}$/, "Contact must contain exactly 10 digits")
    .required("Contact is required"),
});
