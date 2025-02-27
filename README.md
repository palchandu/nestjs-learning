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
     - [Class-validator - validate array of objects](https://stackoverflow.com/questions/58343262/class-validator-validate-array-of-objects)

- **NestJS - How to create nested schema with decorators**
    - [Nested Schema](https://stackoverflow.com/questions/62762492/nestjs-how-to-create-nested-schema-with-decorators)
    - [How to write down nested schemas for mongoose using NestJS](https://stackoverflow.com/questions/67848830/how-to-write-down-nested-schemas-for-mongoose-using-nestjs-nomenclature)
    - [Mongoose Nested Schemas within Arrays](https://github.com/nestjs/mongoose/issues/839)
 
-  **Deploy NestJs Project on Nginx**
    - [How to Deploy a NestJS Application with Nginx on Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-nestjs-application-with-nginx-on-ubuntu)
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


# **📌 Where to Put `utils` and `helpers` in a NestJS Project?**  

In a **scalable NestJS project**, reusable **utility** and **helper functions** should be **kept separate from the business logic** to improve **code reusability and maintainability**.  

---

## **✅ Recommended Folder Structure**
```
📦 my-nestjs-app
 ┣ 📂 src/
 ┃ ┣ 📂 api/                      # API service layer (External APIs)
 ┃ ┣ 📂 common/                   # Shared modules, decorators, guards, interceptors
 ┃ ┣ 📂 config/                   # Config files (DB, ENV, Constants)
 ┃ ┣ 📂 modules/                  # Feature modules (user, auth, products)
 ┃ ┣ 📂 utils/                     # Reusable utility functions
 ┃ ┣ 📂 helpers/                   # Helper functions (feature-specific)
 ┃ ┣ 📂 middleware/                # Express middleware (if needed)
 ┃ ┣ 📂 filters/                   # Global exception filters
 ┃ ┣ 📂 pipes/                     # Custom validation pipes
 ┃ ┣ 📂 guards/                    # Authentication & Authorization guards
 ┃ ┣ 📜 main.ts                    # App entry point
 ┃ ┗ 📜 app.module.ts               # Main App Module
 ┣ 📜 package.json
 ┗ 📜 .env
```

### **📌 Where to Place Utility & Helper Functions?**
| **Folder** | **Purpose** | **Examples** |
|------------|------------|--------------|
| `src/utils/` | **General-purpose reusable functions** (used across modules) | `formatDate()`, `generateUUID()`, `hashPassword()` |
| `src/helpers/` | **Feature-specific functions** (used inside a module) | `validateUser()`, `calculateDiscount()`, `transformResponse()` |

---

## **✅ 1. `utils/` → General Utility Functions (Used Everywhere)**
These are **generic functions** that **can be used across the entire app**, regardless of the module.

📂 **Example File: `src/utils/date.util.ts`**
```ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}
```

📂 **Example File: `src/utils/hash.util.ts`**
```ts
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

✅ **Usage in `UserService`**
```ts
import { hashPassword } from '../utils/hash.util';

async registerUser(userDto: RegisterUserDto) {
  const hashedPassword = await hashPassword(userDto.password);
  return this.userModel.create({ ...userDto, password: hashedPassword });
}
```

---

## **✅ 2. `helpers/` → Module-Specific Helper Functions**
These functions are **only relevant to a specific module** and should be placed inside the respective module.

📂 **Example File: `src/modules/user/helpers/user.helper.ts`**
```ts
export function formatUserResponse(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
```

✅ **Usage in `UserService`**
```ts
import { formatUserResponse } from './helpers/user.helper';

async getUserProfile(id: string) {
  const user = await this.userModel.findById(id);
  return formatUserResponse(user);
}
```

---

## **✅ 3. `common/` → Shared Modules, Guards, Decorators**
If your **utility function is a reusable class or decorator**, place it inside the **`common/` folder**.

📂 **Example File: `src/common/decorators/current-user.decorator.ts`**
```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user; // Retrieves the authenticated user
});
```

✅ **Usage in `UserController`**
```ts
@Get('profile')
getProfile(@CurrentUser() user) {
  return user;
}
```

---

## **🎯 Summary: Best Folder Structure for Utilities & Helpers**
| **Folder** | **Purpose** | **Examples** |
|------------|------------|--------------|
| **`src/utils/`** | General utilities used across the app | `formatDate()`, `hashPassword()`, `generateUUID()` |
| **`src/helpers/`** | Module-specific helper functions | `formatUserResponse()`, `calculateDiscount()` |
| **`src/common/`** | Reusable decorators, guards, interceptors | `@CurrentUser()`, `AuthGuard` |

✅ **Best Practice:**  
- **Use `utils/` for generic, app-wide reusable functions.**  
- **Use `helpers/` inside modules for feature-specific functions.**  
- **Use `common/` for decorators, guards, and shared modules.**  

🚀 **Would you like a boilerplate template with this structure?**

# **📌 Configure NestJS CLI to Generate Files Inside `modules/` Folder**  

By default, when you run the **NestJS CLI (`nest g resource`)**, it generates files inside `src/`. However, you can configure it to place **resources (modules, controllers, services, etc.) inside the `modules/` directory**, and **guards, pipes, filters inside `common/`**.

---

## **✅ Step 1: Modify `nest-cli.json` to Change Default Paths**
### **Modify `nest-cli.json`**
📂 **`nest-cli.json`**
```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "generateOptions": {
    "module": "modules",      // Place all resources inside `modules/`
    "controller": "modules",  // Controllers go inside `modules/`
    "service": "modules",     // Services go inside `modules/`
    "guard": "common/guards", // Guards go inside `common/guards/`
    "pipe": "common/pipes",   // Pipes go inside `common/pipes/`
    "filter": "common/filters", // Filters go inside `common/filters/`
    "interceptor": "common/interceptors", // Interceptors go inside `common/interceptors/`
    "decorator": "common/decorators" // Custom decorators go inside `common/decorators/`
  }
}
```

✅ **Now, whenever you generate a resource, it will be placed inside the correct folder.**  

---

## **✅ Step 2: Verify the Configuration with Examples**
### **📌 1. Create a New Resource (`nest g resource user`)**
```sh
nest g resource user
```
✅ **Before (`Default NestJS CLI Behavior`):**
```
src/
 ┣ 📂 user/
 ┃ ┣ 📜 user.module.ts
 ┃ ┣ 📜 user.controller.ts
 ┃ ┣ 📜 user.service.ts
 ┃ ┗ 📜 dto/
```
✅ **After (`Configured to Use modules/`):**
```
src/
 ┣ 📂 modules/
 ┃ ┣ 📂 user/
 ┃ ┃ ┣ 📜 user.module.ts
 ┃ ┃ ┣ 📜 user.controller.ts
 ┃ ┃ ┣ 📜 user.service.ts
 ┃ ┃ ┗ 📜 dto/
```
👉 **Now, all generated modules go inside `src/modules/`.**

---

### **📌 2. Generate a Guard (`nest g guard auth`)**
```sh
nest g guard auth
```
✅ **Before (`Default NestJS CLI Behavior`):**
```
src/
 ┣ 📜 auth.guard.ts
```
✅ **After (`Configured to Use common/guards/`):**
```
src/
 ┣ 📂 common/
 ┃ ┗ 📂 guards/
 ┃ ┃ ┣ 📜 auth.guard.ts
```
👉 **Now, all generated guards go inside `common/guards/`.**

---

### **📌 3. Generate a Pipe (`nest g pipe validation`)**
```sh
nest g pipe validation
```
✅ **After (`Configured to Use common/pipes/`):**
```
src/
 ┣ 📂 common/
 ┃ ┗ 📂 pipes/
 ┃ ┃ ┣ 📜 validation.pipe.ts
```
👉 **Now, all pipes are placed inside `common/pipes/`.**

---

### **📌 4. Generate a Custom Decorator (`nest g decorator current-user`)**
```sh
nest g decorator current-user
```
✅ **After (`Configured to Use common/decorators/`):**
```
src/
 ┣ 📂 common/
 ┃ ┗ 📂 decorators/
 ┃ ┃ ┣ 📜 current-user.decorator.ts
```
👉 **Now, all decorators are placed inside `common/decorators/`.**

---

## **✅ Step 3: Test and Validate**
After modifying `nest-cli.json`, **restart your NestJS CLI** and run a test command:
```sh
nest g module products
```
✅ **Expected Result:**
```
src/
 ┣ 📂 modules/
 ┃ ┣ 📂 products/
 ┃ ┃ ┣ 📜 products.module.ts
```
🎯 **Now, all new modules, controllers, services, and other resources will follow this structured folder organization automatically!**  

---

## **✅ Final Summary**
| **Resource** | **Default Location** | **New Location (After Configuring `nest-cli.json`)** |
|-------------|----------------------|------------------------------------|
| **Modules (`nest g module <name>`)** | `src/` | `src/modules/` |
| **Controllers (`nest g controller <name>`)** | `src/` | `src/modules/` |
| **Services (`nest g service <name>`)** | `src/` | `src/modules/` |
| **Guards (`nest g guard <name>`)** | `src/` | `src/common/guards/` |
| **Pipes (`nest g pipe <name>`)** | `src/` | `src/common/pipes/` |
| **Filters (`nest g filter <name>`)** | `src/` | `src/common/filters/` |
| **Interceptors (`nest g interceptor <name>`)** | `src/` | `src/common/interceptors/` |
| **Decorators (`nest g decorator <name>`)** | `src/` | `src/common/decorators/` |

🚀 **Would you like a sample GitHub boilerplate with this setup?**



# **📌 Best Practices to Sanitize `req.body` in NestJS (Prevent XSS, SQL Injection, & JS Code Execution)**  

[CSRF Protection](https://docs.nestjs.com/security/csrf)

Sanitizing `req.body` is **critical** to prevent **XSS (Cross-Site Scripting), SQL Injection, and JavaScript execution**. NestJS provides **multiple layers of security** to ensure safe request handling.

---

## **✅ Step 1: Install Security Dependencies**
Use **`class-sanitizer`**, **`express-mongo-sanitize`**, and **`helmet`** for enhanced security.  
```sh
npm install class-validator class-transformer express-mongo-sanitize helmet
```
✅ **What These Do?**  
- **`class-validator`** → Validates input fields.  
- **`class-transformer`** → Removes unwanted properties.  
- **`express-mongo-sanitize`** → Prevents **MongoDB query injections**.  
- **`helmet`** → Adds security headers to prevent common attacks.  

---

## **✅ Step 2: Use `class-validator` & `class-transformer` to Sanitize `req.body`**
Modify your **DTOs (Data Transfer Objects)** to automatically **validate & sanitize inputs**.

📂 **Create `src/dto/user.dto.ts`**
```ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => value.trim()) // Trim spaces
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value.toLowerCase()) // Convert to lowercase
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
```
✅ **Now:**  
- **Extra spaces are removed** (`trim()`).  
- **Email is converted to lowercase**.  
- **Password must be at least 6 characters**.  

---

## **✅ Step 3: Use `ValidationPipe` to Enforce DTO Validation**
Enable `ValidationPipe` in `main.ts` so all incoming `req.body` is **validated & sanitized**.

📂 **Modify `src/main.ts`**
```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Prevent SQL Injection & XSS
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties
      forbidNonWhitelisted: true, // Throw error for extra properties
      transform: true, // Auto-transform DTOs
    })
  );

  // ✅ Protect against common security vulnerabilities
  app.use(helmet()); 

  // ✅ Prevent MongoDB Injection Attacks (removes `$` and `.` from inputs)
  app.use(mongoSanitize());

  await app.listen(3000);
}
bootstrap();
```
✅ **Now:**  
- **Helmet** protects against common security issues (XSS, Clickjacking, etc.).  
- **Mongo Sanitize** prevents **NoSQL injection** (`{ "$gt": "" }`).  
- **DTO validation with `whitelist: true`** removes unwanted fields.  

---

## **✅ Step 4: Create a Custom Sanitization Middleware**
Create a **NestJS middleware** to sanitize **script tags, SQL injections, and JavaScript execution**.

📂 **Create `src/middleware/sanitize.middleware.ts`**
```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeHtml(req.body[key], {
            allowedTags: [], // Remove all HTML tags
            allowedAttributes: {}, // Remove attributes like "onclick"
          });
        }
      }
    }
    next();
  }
}
```
✅ **Now:**  
- **Script tags & JavaScript injection are removed** (`<script>alert('XSS')</script>` → 🗑️).  
- **OnClick events & malicious HTML are stripped**.  

---

## **✅ Step 5: Register Middleware in `app.module.ts`**
📂 **Modify `src/app.module.ts`**
```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SanitizeMiddleware } from './middleware/sanitize.middleware';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeMiddleware).forRoutes('*'); // Apply to all routes
  }
}
```
✅ **Now:**  
- **All incoming `req.body` will be sanitized** before reaching the controller.  
- **Middleware runs on all routes** (`forRoutes('*')`).  

---

## **✅ Step 6: Prevent XSS in API Responses**
Sanitize **outgoing API responses** to **remove JavaScript-injected data**.

📂 **Create `src/interceptors/sanitize.interceptor.ts`**
```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object') {
          for (const key in data) {
            if (typeof data[key] === 'string') {
              data[key] = sanitizeHtml(data[key]);
            }
          }
        }
        return data;
      })
    );
  }
}
```
✅ **Now:**  
- **Malicious HTML tags & scripts are removed before sending API responses.**  
- **Prevents XSS attacks even if stored data contains scripts.**  

### **Register Global Interceptor in `main.ts`**
📂 **Modify `src/main.ts`**
```ts
import { SanitizeResponseInterceptor } from './interceptors/sanitize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SanitizeResponseInterceptor()); // ✅ Apply XSS prevention to all responses

  await app.listen(3000);
}
bootstrap();
```

---

## **✅ Step 7: Use Query Parameter Validation**
Prevent SQL Injection by validating and sanitizing query parameters.

📂 **Modify `user.controller.ts`**
```ts
import { Controller, Get, Query } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

class SearchDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_ ]*$/, { message: 'Invalid search input' }) // Prevent SQL injection
  search: string;
}

@Controller('users')
export class UserController {
  @Get('search')
  async search(@Query() query: SearchDto) {
    return { status: true, data: [], message: 'Search executed' };
  }
}
```
✅ **Now SQL injection attempts (`DROP TABLE users;`) will be blocked.**

---

## **🎯 Final Summary**
| **Security Feature** | **How It Helps** |
|----------------|---------------------------|
| **DTO Validation (`class-validator`)** | Ensures only valid inputs are accepted. |
| **`helmet()` Middleware** | Adds security headers to prevent attacks. |
| **`express-mongo-sanitize`** | Prevents MongoDB NoSQL injection. |
| **Custom Middleware (`sanitize-html`)** | Strips script tags & JavaScript from `req.body`. |
| **Response Interceptor** | Prevents XSS attacks by sanitizing API responses. |
| **Query Parameter Validation** | Prevents SQL injection via query parameters. |

🚀 **Now your NestJS app is safe from XSS, SQL injection, and JavaScript execution!** Would you like a **pre-configured NestJS security template**? 🚀


## Updating Nested Array Mongoose

To **add a new section** inside the `menus.sections` array and **add a new item** inside a specific section's `items` array, use the **MongoDB `$push` operator**.

---

## **1️⃣ Add a New Section to `menus.sections`**
```js
db.menus.updateOne(
  { _id: ObjectId("67bee8de2fa99a9626ae9d14") },  // Find the menu
  { 
    $push: { 
      "menus.0.sections": {   // Add a new section inside the first menu
        _id: ObjectId(),  // Generate a new ObjectId for the section
        labels: [
          {
            displayName: "Desserts",
            description: "Sweet and delicious treats",
            languageCode: "en"
          }
        ],
        items: []  // Initially empty, items will be added later
      }
    }
  }
);
```
✅ This adds a **new section** to the first menu inside the `menus` array.

---

## **2️⃣ Add a New Item to a Specific Section**
To add a new item inside an **existing section’s `items` array`**, you need to match the **menu and section `_id`**.

```js
db.menus.updateOne(
  { 
    _id: ObjectId("67bee8de2fa99a9626ae9d14"),  // Find the menu
    "menus.sections._id": ObjectId("NEW_SECTION_ID")  // Find the correct section
  },
  { 
    $push: { 
      "menus.$.sections.$[section].items": {  // Add item to the matched section
        _id: ObjectId(),  // Generate a new ObjectId for the item
        labels: [
          {
            displayName: "Chocolate Cake",
            description: "Rich and moist chocolate cake",
            languageCode: "en"
          }
        ],
        attributes: {
          price: {
            currencyCode: "USD",
            units: "8",
            nanos: 0
          },
          spiciness: "NONE",
          allergen: ["Gluten", "Dairy"],
          dietaryRestriction: ["Vegetarian"],
          servesNumPeople: 1
        },
        options: []
      }
    }
  },
  { arrayFilters: [{ "section._id": ObjectId("NEW_SECTION_ID") }] } // Filters to update only the correct section
);
```
ou like a function in **Mongoose/NestJS** to handle this dynamically? 🚀

### **What is `arrayFilters` in MongoDB?**  

`arrayFilters` is an **option used in MongoDB's update operations** to target specific **elements inside arrays** when updating **nested array elements**.  

---

### **🔍 Why Use `arrayFilters`?**  
In MongoDB, when updating a nested array (like `menus.sections.items`), you need to ensure that **only the correct section gets updated**.  

By default, `$push` without `arrayFilters` might **not know which section** to add the new item to.  
So, `arrayFilters` **filters the correct section** to update.

---

### **🛠 Breakdown of `arrayFilters` in Your Query**
```js
db.menus.updateOne(
  { 
    _id: ObjectId("67bee8de2fa99a9626ae9d14"),  // Find the menu
    "menus.sections._id": ObjectId("NEW_SECTION_ID")  // Find the correct section
  },
  { 
    $push: { 
      "menus.$.sections.$[section].items": {  // Add item to the matched section
        _id: ObjectId(),  
        labels: [
          {
            displayName: "Chocolate Cake",
            description: "Rich and moist chocolate cake",
            languageCode: "en"
          }
        ],
        attributes: {
          price: {
            currencyCode: "USD",
            units: "8",
            nanos: 0
          },
          spiciness: "NONE",
          allergen: ["Gluten", "Dairy"],
          dietaryRestriction: ["Vegetarian"],
          servesNumPeople: 1
        },
        options: []
      }
    }
  },
  { arrayFilters: [{ "section._id": ObjectId("NEW_SECTION_ID") }] } // Filters to update only the correct section
);
```

---

### **📌 Explanation**
1. **Finds the menu document** where `_id = "67bee8de2fa99a9626ae9d14"`.
2. **Finds the correct section** where `menus.sections._id = "NEW_SECTION_ID"`.
3. **Uses `$push`** to add a new `item` inside `sections.items`.
4. **`arrayFilters`:**  
   - `"section._id": ObjectId("NEW_SECTION_ID")`  
   - This means: **Find the section where `_id = NEW_SECTION_ID` and update only that one**.

---

### **🎯 Without `arrayFilters`, what happens?**
If you **don't use `arrayFilters`**, MongoDB **does not know which section** to update, leading to errors like:
```
Updating the path 'menus.sections.items' would create a conflict at 'menus.sections'
```
or **incorrect updates** in all sections.

---

