const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.customer.create(data, { files });
    } else
    {
    console.log(ctx.request.body)
      entity = await strapi.services.customer.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.customer });
    },
    

    async update(ctx) {
        const { id } = ctx.params;
        console.log(id)
    
        let entity;
        if (ctx.is('multipart'))
        {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.customer.update({ id }, data, {
                files,
            });
        } else
        {
            

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
            let mainData = {
                "transitions": transitionID,
                "name": ctx.request.body.name,
                "Father_name": ctx.request.body.Father_name,
                "phone_number": ctx.request.body.phone_number,
                "village": ctx.request.body.village,
                "total_due": ctx.request.body.total_due,
                "previous_due": ctx.request.body.previous_due,
                "new": ctx.request.body.new
            }
            console.log(mainData)
            console.log(ctx.request.body)
            console.log(id)
          entity = await strapi.services.customer.update({ id }, mainData);
        }
    
        return sanitizeEntity(entity, { model: strapi.models.customer });
      },


};