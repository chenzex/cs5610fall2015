module.exports = function(mongoose) {
    
    var FieldSchema = mongoose.Schema({
        id : String,
        formId: String,
        label: String,
        type: String,
        options: [{
            label: String,
            value: String
        }],
        placeholder: String
    },{collection: "fields"});

    var FormSchema = mongoose.Schema({
        id: String,
        title: String,
        userId: String,
        fields: [FieldSchema]
    },{collection: "forms"});
    return FormSchema;
};