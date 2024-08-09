// controllers/contentController.js

const ContentService = require('../services/contentService');
const Content = require('../models/contentModel');

class ContentController {

  async getAllContents(req, res) {
    try {
      const contents = await ContentService.getAllContents();
      res.status(200).json(contents);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch contents', error: error.message });
    }
  }

  async getContentById(req, res) {
    
    try {
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({ error: 'Invalid Id' });
      }
      else
      {
        const content = await ContentService.getContentById(req.params.id);
        if (!content) {
          return res.status(404).json({ message: 'Content not found' });
        }
        res.status(200).json(content);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch content', error: error.message });
    }
  }

  async getContentByCategory(req, res) {
    try {
      const contents = await ContentService.getContentByCategory(req.params.category);
      res.status(200).json(contents);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch contents by category', error: error.message });
    }
  }

  async getContentByType(req, res) {
    try {
      const contents = await ContentService.getContentByType(req.params.type);
      res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contents by type', error: error.message });
    }
  }

  async searchContents(req, res) {
    try {
      const contents = await ContentService.searchContents(req.body);
      if (contents.length == 0) {
        res.status(204);
      }
      res.status(200).json(contents);
    } catch (error) {
        if (err.cause === 'FiltersError') {
            res.status(404);
            res.json({ error : err.message });
          } else {
            res.status(500).json({ message: 'Failed to fetch contents by type', error: error.message });
          }
      
    }
  }

  async createContent(req, res) {
    try {
      const content = await ContentService.createContent(req.body);
      res.status(201).json(content);
    } catch (error) {
        if (error.name === 'ValidationError')
            res.status(400).json({message: error.message});
        else
        res.status(500).json({ message: 'Failed to create content', error: error.message });
        }
  }

  async updateContent(req, res) {      
    try {
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({ error: 'Invalid Id' });
      }
      else
      {
        const content = await ContentService.updateContent(req.params.id, req.body);
        if (!content) {
          return res.status(404).json({ message: 'Content not found' });
        }
        res.status(200).json(content);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update content', error: error.message });
    }
  }

  async deleteContent(req, res) {
    try {
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({ error: 'Invalid Id' });
      }
      else
      {
        const content = await ContentService.deleteContent(req.params.id);
        if (!content) {
          return res.status(404).json({ message: 'Content not found' });
        }
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete content', error: error.message });
    }
  }
}

module.exports = new ContentController();

