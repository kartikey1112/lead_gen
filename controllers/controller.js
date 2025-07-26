const prisma = require("../client");
const {
  processWithGeminiAI,
  sendWhatsappMessage,
  makeVoiceCall,
} = require("../utils/helper");
require("dotenv").config();

async function createLead(req, res) {
  try {
    const { name, phone, city, product, user_message } = req.body;
    if (!name || !phone || !city || !product || !user_message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { ai_detected_intent, score, tags } = await processWithGeminiAI(
      user_message
    );
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        city,
        product,
        user_message,
        ai_detected_intent,
        score,
        tags: JSON.stringify(tags),
      },
    });

    await sendWhatsappMessage(phone, name);
    await makeVoiceCall(phone);

    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function fetchLeads(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        select: {
          name:true,
          phone:true,
          status: true,
          product:true,
          user_message:true,
          score: true,
          city: true,
          ai_detected_intent: true,
          tags: true,
          name: true
        },
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc'
        }
      }),
      prisma.lead.count()
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      leads,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = { createLead, fetchLeads };
