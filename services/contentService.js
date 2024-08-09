const contentRepository = require('../repositories/contentRepository');
const Content = require('../models/contentModel');

class ContentService {
  async getAllContents() {
    return await contentRepository.getAllContents();
  }

  async getContentById(id) {
    const content = await contentRepository.getContentById(id);
    return content;
  }

  async getContentByCategory(category) {
    return await contentRepository.getContentByCategory(category);
  }

  async getContentByType(type) {
    return await contentRepository.getContentByType(type);
  }

  async searchContents(filters) {
    const validFilters = Object.keys(Content.schema.paths);
    const invalidFilters = Object.keys(filters).filter(key => !validFilters.includes(key));
    
    if (invalidFilters.length > 0)
      throw new Error(`Invalid parameter ${invalidFilters[0]}`, {cause: "FiltersError"});

    return await contentRepository.searchContents(filters);
  }

  async createContent(contentData) {
    return await contentRepository.createContent(contentData);
  }

  async updateContent(id, updateData) {
    const content = await contentRepository.updateContent(id, updateData);
    return content;
  }

  async deleteContent(id) {
    const content = await contentRepository.deleteContent(id);
    return content;
  }
}

module.exports = new ContentService();
