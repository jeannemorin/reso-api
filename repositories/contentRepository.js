const Content = require('../models/contentModel');


class ContentRepository {
    async getAllContents() {
        return await Content.find();
    };

    async getContentById(id) {
        return await Content.findById(id);
    };

    async getContentByCategory(category) {
        return await Content.find({ category });
    };

    async getContentByType(type) {
        return await Content.find({ type });
    };

    async searchContents(query) {
        return await Content.find(query);
    };

    async createContent(contentData) {
    const content = new Content(contentData);
        return await content.save();
    };

    async updateContent(id, updateData) {
        const allowedUpdates = ['title', 'category', 'thumbnailUrl'];
        const updates = {};

        allowedUpdates.forEach((key) => {
            if (updateData[key]) {
            updates[key] = updateData[key];
            }
    });

        return await Content.findByIdAndUpdate(id, updates, { new: true });
    };

    async deleteContent(id) {
        return await Content.findByIdAndDelete(id);
    };
}

module.exports = new ContentRepository();
