import { Router } from "express";
import { 
  fetchRecycleBin, 
  addToRecycleBin, 
  deleteFromRecycleBin, 
  clearRecycleBin, 
  restoreFromRecycleBin, 
  getDb 
} from "../../serverDb";

const router = Router();

// GET all items in recycle bin
router.get("/", async (req, res) => {
  try {
    const data = await fetchRecycleBin();
    res.json(data);
  } catch (err: any) {
    console.error("[RecycleBin Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch recycle bin" });
  }
});

// POST add item(s) to recycle bin
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const items = Array.isArray(payload) ? payload : [payload];
    if (items.length === 0) {
      return res.status(400).json({ error: "No items provided to move to recycle bin" });
    }

    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }

    const updated = await addToRecycleBin(items);
    res.json(updated);
  } catch (err: any) {
    console.error("[RecycleBin Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to add to recycle bin" });
  }
});

// POST restore item(s) from recycle bin
router.post("/restore", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Expected an array of ids to restore" });
    }

    const result = await restoreFromRecycleBin(ids);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("[RecycleBin Router] Restore Error:", err);
    res.status(500).json({ error: err.message || "Failed to restore from recycle bin" });
  }
});

// POST permanently delete single or multiple items from recycle bin
router.post("/delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Expected an array of ids to delete" });
    }

    const remaining = await deleteFromRecycleBin(ids);
    res.json({ success: true, remaining });
  } catch (err: any) {
    console.error("[RecycleBin Router] Delete Error:", err);
    res.status(500).json({ error: err.message || "Failed to permanently delete from recycle bin" });
  }
});

// POST or DELETE one-click clear recycle bin
router.post("/clear", async (req, res) => {
  try {
    await clearRecycleBin();
    res.json({ success: true, message: "Recycle bin completely cleared" });
  } catch (err: any) {
    console.error("[RecycleBin Router] Clear Error:", err);
    res.status(500).json({ error: err.message || "Failed to clear recycle bin" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await clearRecycleBin();
    res.json({ success: true, message: "Recycle bin completely cleared" });
  } catch (err: any) {
    console.error("[RecycleBin Router] Clear Error:", err);
    res.status(500).json({ error: err.message || "Failed to clear recycle bin" });
  }
});

export default router;
