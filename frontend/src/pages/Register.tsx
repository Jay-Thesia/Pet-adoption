import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { registerSchema } from '../validations/authValidation';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful!');
      navigate('/home');
    } catch (err: any) {
      // Error is already handled by API interceptor
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              {...register('name')}
            />
            {errors.name && (
              <div className="error-message">{errors.name.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
            />
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password')}
            />
            {errors.password && (
              <div className="error-message">{errors.password.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
