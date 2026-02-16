import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "../models/user.model";
import { UserRole } from "../constants/roles";

config();

const fixManagerRoles = async () => {
    try {
        console.log("🔌 Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/warehouse-logistics");
        console.log("✅ Connected to database");

        console.log("🔍 Finding users with old 'MANAGER' role...");
        // Use 'MANAGER' string literal since it's not in the enum anymore
        const result = await User.updateMany(
            { role: "MANAGER" },
            { $set: { role: UserRole.WAREHOUSE_MANAGER } }
        );

        console.log(`✨ Fixed ${result.modifiedCount} users.`);

        if (result.matchedCount === 0) {
            console.log("👍 No users needed fixing.");
        }

        console.log("👋 Closing connection...");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing roles:", error);
        process.exit(1);
    }
};

fixManagerRoles();
