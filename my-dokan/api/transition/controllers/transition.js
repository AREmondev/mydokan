const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

    async create(ctx) {
        let entity;
        let returnValue;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.transition.create(data, { files });
    } else
    {
        entity = await strapi.services.transition.create(ctx.request.body);
        
        console.log(entity)
        const id = ctx.request.body.customer_id;
        let newEntity = await strapi.services.customer.findOne({ id });
        let transitions = newEntity.transitions
        var transitionID = []
        for (let i = 0; i < transitions.length; i++)
        {
            var newItem = {
                "_id":  `${transitions[i]._id}`
            }
            transitionID.push(newItem)
        }
        transitionID.push({ "_id": `${entity._id}` })
        console.log('payment',parseInt(entity.payment))
        let mainData = {
            "transitions": transitionID,
            "name": newEntity.name,
            "Father_name": newEntity.Father_name ?  newEntity.father_name : '',
            "phone_number": newEntity.phone_number ? newEntity.phone_number : '',
            "village": newEntity.village ? newEntity.village : '',
            "total_due": parseInt(newEntity.total_due) - parseInt(entity.payment),
            "previous_due": newEntity.previous_due ? newEntity.previous_due : 0,
            "new": newEntity.new
        }
        returnValue = await strapi.services.customer.update({ id }, mainData);
    }
    return sanitizeEntity(returnValue, { model: strapi.models.transition });
    },

};