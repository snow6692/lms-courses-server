import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: "user" | "admin";
  isVerified: boolean;
  courses: Array<{ courseId: mongoose.Types.ObjectId }>;
  comparePassword: (password: string) => Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => EMAIL_REGEX.test(email),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [9, "Password must be at least 9 characters"],
      select: false,
      validate: {
        validator: function (v: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          );
        },
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      },
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// === Hash Password ===
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error: any) {
    next(error);
  }
});

// === Compare Password ===
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model("User", userSchema);
export default User;
