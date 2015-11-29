module.exports = function(mongoose) {

    var FieldSchema = mongoose.Schema({
        id : String,
        formId: String,
        label: String,
        // type: ["TEXT", "TEXTAREA", "RADIO", "CHECKBOX", "SELECT", "DATE"],
        type: String,
        options: [{
            label: String,
            value: String
        }],
        placeholder: String
    },{collection: "fields"});
    return FieldSchema;
};