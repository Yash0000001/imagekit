'use client';

import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type FormValues = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { push } = useRouter();

    const onSubmit = async (data: FormValues) => {
        if (loading) return;
        setLoading(true);
        setError('');

        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })
            if (res?.error) {
                toast.error(res.error)
            } else {
                reset();
                toast.success('Logged in Successfully')
                push("/")
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
                setError(error.message)
            } else {
                toast.error('Something went wrong');
                setError('Something went wrong')
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-black">
            <div className="flex flex-col items-center justify-center border-2 border-white p-8 rounded-2xl w-full max-w-md gap-4">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <h1 className="text-4xl text-white mb-5">Login</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-full items-center justify-center gap-2"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: 'Invalid email format',
                            },
                        })}
                        className="border px-3 py-2 rounded w-full mb-1 text-white bg-transparent"
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mb-2">{errors.email.message}</p>
                    )}

                    <div className='relative w-full mb-1'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="new-password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            className="border px-3 py-2 rounded w-full mb-1 text-white bg-transparent"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-sm mb-2">{errors.password.message}</p>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-2 text-white"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 flex items-center justify-center mt-3 mb-3 w-full cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <span className="loader mr-2"></span> Signing...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                <p className="text-white">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-400">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
