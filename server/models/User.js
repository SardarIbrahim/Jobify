import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 20,
      trim: true,
    },

    lastName: {
      type: String,
      maxlength: 20,
      default: 'your last name',
    },

    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,

      // built-in
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false,
    },

    lastName: {
      type: String,
      maxlength: 20,
      trim: true,
      default: 'your last name',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 20,
      default: 'my city',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  // this hook is called on methods so on updating user
  if (!this.isModified('password')) return;

  // because we don't want to hash the password again

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = async function () {
  return JsonWebToken.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
export default mongoose.model('User', UserSchema);
