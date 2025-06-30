<!-- review Markdown (Ctrl+Shift+V) --> 

Here is your **clean, ready-to-save `.md` document** for your **versioned model strategy with Mongoose**:

---

# 📄 Handling Model Changes in API Versioning (`Node + TypeScript + Mongoose`)

## ✅ Scenario Recap

* You have:

  * `common/models/user_model.ts` used in **`v1` to `v5`**.
* Now, in **`v6`**, you need to **change the `User` schema** (add new fields, structure adjustments).

---

## ✅ What to Do

### 1️⃣ Create a version-specific model **only for `v6`**:

✅ Create:

```
src/v6/models/user_model.ts
```

✅ In `v6` controllers:

```ts
import User from "../models/user_model";
```

✅ This keeps **`v1`–`v5` working without changes**, while allowing **`v6` to evolve** the `User` schema.

---

### 2️⃣ Continue using `common/models/user_model.ts` for `v1`–`v5`.

✅ No need to move or rename anything for previous versions.

---

## ✅ Why This Is the Cleanest Approach

✅ **No breaking changes** for existing API versions.  
✅ Only **`v6` uses the updated schema**.  
✅ Keeps your **version separation consistent with your MRC structure**.  
✅ Future `v7` can:  

* Use `v6`’s model if compatible, or
* Create `v7/models/user_model.ts` if further changes occur.

---

## 🩶 Example

### `common/models/user_model.ts`

```ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

export default mongoose.model("User", userSchema);
```

---

### `v6/models/user_model.ts`

```ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String, // new in v6
    isActive: { type: Boolean, default: true }, // new in v6
});

export default mongoose.model("User", userSchema);
```

---

## ❓ What If MongoDB Has a Single `users` Collection?

✅ By default, **Mongoose maps both schemas to the same `users` collection** unless you explicitly specify otherwise:  

```ts
export default mongoose.model("User", userSchema, "users");
```

✅ This allows **partial backward compatibility**:  

* Old documents won’t have new fields unless updated.
* New fields will exist only in `v6` created/updated documents.

---

### ✅ If you need **different collections** (e.g., major structural differences requiring separate storage):  

```ts
export default mongoose.model("UserV6", userSchema, "users_v6");
```

> Use this only for **significant schema changes** requiring isolation.

---

## ✅ Summary

✅ `v6` introduces a new `user_model.ts` in `v6/models`.  
✅ Previous versions (`v1`–`v5`) continue using `common/models/user_model.ts`.  
✅ **No breaking changes for old APIs.**  
✅ Clean, maintainable, scalable for **Node + TypeScript backend architecture**.  

---

## 🚀 Next Steps

✅ Generate a clean `v6/models/user_model.ts` template when ready.  
✅ Plan migration scripts if you need to backfill new fields in existing documents.  
✅ Write version-specific test cases to validate `v6` model behavior without affecting `v1`–`v5`.  

---

⚡ **This structure ensures your backend remains clean and scalable while confidently managing API versioning.**

---

If you would like, I can prepare a **migration checklist or seeding strategy** aligned with this approach to keep your MongoDB consistent as you transition to `v6`.

---

If you want, I can also generate **a GitHub-friendly `README.md` for your `express-app` backend using this structure** for your organized workflow. Let me know!
