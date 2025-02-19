<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Nestjs Learning Resources

[Nest framework TypeScript starter repository.](https://github.com/nestjs/nest) 

[How to learn Nest JS?](https://dev.to/nadim_ch0wdhury/how-to-learn-nest-js-20nc) 

[Nest JS Tutorial #1: Create Your First API](https://dev.to/nandhakumar/nest-js-part-1-creating-your-first-api-5f2a) 

[Comprehensive NestJS Course](https://www.freecodecamp.org/news/comprehensive-nestjs-course/) 

[Nest.js Full Course for Beginners | Complete All-in-One Tutorial | 3 Hours](https://www.youtube.com/watch?v=8_X0nSrzrCw)

## NestJs Validation using [Pipe](https://docs.nestjs.com/pipes#custom-pipes)
  - [Decorator Based Validation | Using Class Validator | Request Body Validation](https://www.youtube.com/watch?v=xjJM5C2QYCM&t=461s)
  - [Amazing NestJS - NestJS Framework](https://www.youtube.com/watch?v=v2w6jzbHTic&list=PLqLR2H326bY6eRNOXJxWQkvKNlzmJQfLj)
  - [Amazing NestJS - NestJS Framework (Hindi) | Youtube Series](https://github.com/palchandu/amazing-nestjs-complete-tutorial)                                                                                                                                                                                                                        
    
## Learning Resource
 - [NestJs : NestJs Validation Explained in Hindi](https://www.youtube.com/watch?v=ZR5WoojlOTA&list=PLVo1k_VwkKMyxkNyMFTtcMcfNHA3xKjZ0&index=9)
 - Package required for validation
     - [class-transformer](https://www.npmjs.com/package/class-transformer)
     - [class-validator](https://www.npmjs.com/package/class-validator)


# **📌 Validating `req.body` in NestJS**
In NestJS, you can validate the `req.body` (incoming request payload) using **DTOs (Data Transfer Objects)** and **Pipes** with `class-validator` and `class-transformer`.

---

## **✅ 1. Install Validation Packages**
Run the following command to install necessary dependencies:
```sh
npm install class-validator class-transformer
```

---

## **✅ 2. Create a DTO (Data Transfer Object) for Validation**
A DTO defines the expected structure and validation rules for the request body.

📂 **`src/user/dto/create-user.dto.ts`**
```ts
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
```
🔹 **`@IsNotEmpty()`** → Ensures a required field is not empty.  
🔹 **`@IsEmail()`** → Validates email format.  
🔹 **`@MinLength(6)`** → Ensures password is at least 6 characters long.  

---

## **✅ 3. Apply Validation in the Controller Using `ValidationPipe`**
NestJS provides `ValidationPipe`, which enforces validation rules from the DTO.

📂 **`src/user/user.controller.ts`**
```ts
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true })) // Apply validation for this route
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
```
🔹 **`@UsePipes(new ValidationPipe({ whitelist: true }))`** → Enforces DTO validation.  
🔹 **`whitelist: true`** → Removes extra fields that are not defined in DTO.  

---

## **✅ 4. Enable Global Validation (Optional)**
Instead of applying `ValidationPipe` on each method, you can enable it globally in `main.ts`.

📂 **`src/main.ts`**
```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  await app.listen(3000);
}
bootstrap();
```
🔹 **Now all `@Body()` requests in the app will be validated automatically.**  

---

## **✅ 5. Test API Validation**
### **📌 Valid Request**
🔹 **Request:**
```json
POST /api/user
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
🔹 **Response:**
```json
{
  "_id": "65b7e88b8d16b2a8a9f4e3c9",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
✅ **User successfully created.**

---

### **📌 Invalid Request (Missing Password)**
🔹 **Request:**
```json
POST /api/user
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
🔹 **Response:**
```json
{
  "statusCode": 400,
  "message": ["Password is required"],
  "error": "Bad Request"
}
```
❌ **Validation failed because the password is required.**

---

### **📌 Invalid Request (Wrong Email Format)**
🔹 **Request:**
```json
POST /api/user
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "secret123"
}
```
🔹 **Response:**
```json
{
  "statusCode": 400,
  "message": ["Invalid email format"],
  "error": "Bad Request"
}
```
❌ **Validation failed due to an invalid email format.**

---

## **🎯 Summary**
| **Feature** | **Implementation** |
|------------|----------------|
| **Define Validation Rules** | Use DTO with `class-validator` decorators |
| **Apply Validation in Controller** | `@UsePipes(new ValidationPipe())` |
| **Enable Global Validation** | `app.useGlobalPipes(new ValidationPipe())` in `main.ts` |
| **Prevent Extra Fields** | Use `{ whitelist: true }` |
| **Custom Error Messages** | Define messages inside decorators |

🚀 Would you like an example of **custom error handling for validation errors**?


## **📌 Should You Use Module-Level DTO Validation with a Custom Pipe or Global-Level Validation in NestJS?**  

It depends on your **project size, maintainability, and reusability needs**.  
There are **two main approaches** to DTO validation in NestJS:  

1. **Global-Level Validation** → Recommended for most cases.  
2. **Module-Level Custom Pipe Validation** → Useful for fine-grained control.  

---

## **✅ 1. Global-Level Validation (Recommended for Most Cases)**
🔹 **Advantages:**  
✅ Ensures **all request bodies** are validated **without repetition**.  
✅ Enforces **consistent validation** across the entire application.  
✅ Reduces boilerplate in controllers.  

### **📌 How to Enable Global Validation?**
Modify **`main.ts`**:

📂 **`src/main.ts`**
```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out unknown properties
      forbidNonWhitelisted: true, // Throws an error for extra fields
      transform: true, // Automatically transforms DTOs
    })
  );

  await app.listen(3000);
}
bootstrap();
```
🔹 **Now, all request bodies in your app are validated without needing `@UsePipes()` in every controller.**  

### **📌 Example DTO Validation**
📂 **`src/user/dto/create-user.dto.ts`**
```ts
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
```
---

## **✅ 2. Module-Level Custom Pipe Validation (When You Need More Control)**
If you need **different validation rules per module** or **custom error handling**, use a **custom validation pipe** inside each module.

🔹 **Advantages:**  
✅ Allows **different validation strategies** for different modules.  
✅ Useful for **complex validation cases** (e.g., user roles, dynamic rules).  
✅ Can be extended to **log validation errors** before throwing an exception.

### **📌 Step 1: Create a Custom Validation Pipe**
📂 **`src/common/pipes/custom-validation.pipe.ts`**
```ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert request body to DTO instance
    const object = plainToInstance(metatype, value);
    
    // Validate DTO
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map(err => Object.values(err.constraints)).flat()
      );
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

### **📌 Step 2: Apply Custom Pipe in the Controller**
📂 **`src/user/user.controller.ts`**
```ts
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new CustomValidationPipe()) // Apply custom validation pipe only for this route
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
```

---

## **✅ Comparison: Global-Level vs. Module-Level Validation**
| Feature | **Global-Level Validation** (`main.ts`) | **Module-Level Custom Pipe** |
|---------|--------------------------------|-----------------------------|
| **Where to Apply** | Once in `main.ts` (affects all routes) | Applied in each controller method |
| **Reusability** | ✅ High (no repetition) | ❌ Low (must manually apply per route) |
| **Consistency** | ✅ Enforces uniform validation across app | ❌ Allows different rules per module |
| **Performance** | ✅ Optimized | ✅ Optimized |
| **Customization** | ❌ Limited error handling | ✅ Custom error messages, logging |
| **Best for** | ✅ Large-scale apps with unified validation | ✅ Complex validation per module |

---

## **🚀 Which Approach Should You Use?**
### **✅ Use Global Validation (`main.ts`) if:**
- Your project follows **a consistent validation approach** across all modules.  
- You don’t want to repeat `@UsePipes(new ValidationPipe())` in every controller.  
- Your API should **strictly follow DTO rules for all requests**.  

✅ **Recommended for most NestJS applications**.  

### **✅ Use Module-Level Custom Pipes if:**
- You need **different validation strategies per module**.  
- You need **custom error handling**, logging, or transformation logic.  
- You want to **bypass validation for certain routes**.  

✅ **Useful for projects with complex validation rules.**  

---

## **🎯 Final Recommendation**
🚀 **For most cases, enable Global Validation (`main.ts`).**  
🚀 **If you need more control, use a custom validation pipe at the module level.**  

Would you like an example of **custom exception handling with validation pipes**? 🚀


# **📌 Can You Use Both Global and Module-Level Validation in NestJS?**  
✅ **Yes! You can use both Global and Module-Level validation pipes together** in NestJS.  

### **🔹 When Should You Use Both?**  
- **Global Validation (`main.ts`)** → Handles **basic validation** for the entire app (e.g., DTO validation).  
- **Module-Level Custom Validation Pipe** → Provides **fine-grained control** for specific routes/modules (e.g., custom error handling, logging).  

---

## **✅ 1. Enable Global Validation for Basic DTO Validation**
First, enable **global validation** in `main.ts` to enforce **basic DTO validation** across the app.

📂 **`src/main.ts`**
```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // Removes unknown properties
      forbidNonWhitelisted: true, // Throws error for extra properties
      transform: true,  // Automatically transforms DTOs
    })
  );

  await app.listen(3000);
}
bootstrap();
```
🔹 **Now, all DTOs across the app will be validated automatically.**  
🔹 This removes **extra fields** and prevents **unexpected inputs**.

---

## **✅ 2. Create a Custom Validation Pipe for Module-Level Validation**
If you need **custom validation for specific routes**, create a **custom validation pipe**.

📂 **`src/common/pipes/custom-validation.pipe.ts`**
```ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert raw input to class instance
    const object = plainToInstance(metatype, value);
    
    // Validate DTO
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map(err => Object.values(err.constraints)).flat()
      );
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```
🔹 This pipe **extends global validation** by adding **custom error messages** and extra validation logic.  

---

## **✅ 3. Apply Custom Validation in Specific Controllers**
Even though **global validation is enabled**, you can still use **custom validation pipes for specific controllers**.

📂 **`src/user/user.controller.ts`**
```ts
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new CustomValidationPipe()) // Applies only to this method
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
```
🔹 **Even though `main.ts` has global validation, this route will use `CustomValidationPipe`.**  
🔹 This is useful when a module requires **custom error handling, logging, or extra checks**.  

---

## **✅ 4. Example API Tests**
### **📌 1. Valid Request (Global Validation Applied)**
🔹 **Request:**
```json
POST /api/user
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
🔹 **Response:**
```json
{
  "_id": "65b7e88b8d16b2a8a9f4e3c9",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
✅ **User successfully created**.

---

### **📌 2. Invalid Request (Missing Password, Global Validation Applied)**
🔹 **Request:**
```json
POST /api/user
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
🔹 **Response:**
```json
{
  "statusCode": 400,
  "message": ["Password is required"],
  "error": "Bad Request"
}
```
❌ **Global validation catches the missing password.**

---

### **📌 3. Invalid Request (Extra Field, Global Validation Applied)**
🔹 **Request:**
```json
POST /api/user
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "admin"  // Not defined in DTO
}
```
🔹 **Response:**
```json
{
  "statusCode": 400,
  "message": ["property role should not exist"],
  "error": "Bad Request"
}
```
❌ **Global validation (`whitelist: true`) removes extra properties.**

---

### **📌 4. Invalid Request (Custom Validation Applied)**
🔹 **Request:**
```json
POST /api/user
{
  "name": "",
  "email": "invalid-email",
  "password": "123"
}
```
🔹 **Response (Custom Validation Applied):**
```json
{
  "statusCode": 400,
  "message": [
    "Name is required",
    "Invalid email format",
    "Password must be at least 6 characters"
  ],
  "error": "Bad Request"
}
```
❌ **Custom validation pipe handles multiple errors in one response.**

---

## **✅ 5. Summary: Using Both Global & Module-Level Validation**
| Feature | **Global Validation (`main.ts`)** | **Module-Level Validation (Custom Pipe)** |
|---------|----------------------------------|----------------------------------|
| **Where Applied?** | All modules & routes | Specific controllers/methods |
| **How Applied?** | `app.useGlobalPipes(new ValidationPipe())` | `@UsePipes(new CustomValidationPipe())` |
| **Customization?** | Limited | Full customization (logging, extra rules) |
| **Best For?** | Basic DTO validation | Complex validation per module |

---

## **🎯 Final Recommendation**
🚀 **Use Global Validation (`main.ts`) for basic DTO validation across the app.**  
🚀 **Use Module-Level Custom Pipes when you need advanced validation, logging, or error customization.**  
🚀 **This hybrid approach gives you flexibility, consistency, and maintainability.**  

Would you like an example of **custom exception handling for validation errors**? 🚀
