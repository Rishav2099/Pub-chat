import React from 'react'
import Signup from '../components/Signup'
import {useForm} from 'react-hook-form'

const SignupPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

      const onSubmit = (data) => console.log(data)
      
  return (
    <div>
      <Signup />
    </div>
  )
}

export default SignupPage
