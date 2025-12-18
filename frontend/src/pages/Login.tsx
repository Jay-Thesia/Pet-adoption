import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { loginSchema } from '../validations/authValidation';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });

  const onError = (errors: any): void => {
    const errorMessages = Object.values(errors).map((error: any) => error.message);
    if (errorMessages.length > 0) {
      errorMessages.forEach((message: string) => {
        toast.error(message);
      });
    }
  };

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      toast.success('Login successful!');
      navigate('/home');
    } catch (err: any) {
      setIsSubmitting(false);

    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
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
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
