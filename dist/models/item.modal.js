"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = exports.ItemStatus = exports.ItemAvailability = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ItemAvailability;
(function (ItemAvailability) {
    ItemAvailability["AVAILABLE"] = "AVAILABLE";
    ItemAvailability["UNAVAILABLE"] = "UNAVAILABLE";
})(ItemAvailability || (exports.ItemAvailability = ItemAvailability = {}));
var ItemStatus;
(function (ItemStatus) {
    ItemStatus["ACTIVE"] = "ACTIVE";
    ItemStatus["INACTIVE"] = "INACTIVE";
})(ItemStatus || (exports.ItemStatus = ItemStatus = {}));
const ItemSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    availability: { type: String, enum: Object.values(ItemAvailability), default: ItemAvailability.AVAILABLE },
    status: { type: String, enum: Object.values(ItemStatus), default: ItemStatus.ACTIVE },
    imageUrl: { type: String, required: false },
}, {
    timestamps: true,
});
exports.ItemModel = mongoose_1.default.model("Item", ItemSchema);
