({
	doInit : function( component, event, helper ) {
		helper.onInit( component, event, helper );
	},
    closeNotification : function( component, event, helper ) {
		var index = event.getSource().get("v.class");
        helper.removeLead( component, index );
    },
    acceptLead : function( component, event, helper ){
        debugger;
        // get lead record
        var index = event.getSource().get("v.class");
        var lead = component.get("v.lstLead")[index];
    	
        // Update lead owner to current logged In user. 
        // Open lead record and let Sales rep work on it.
        helper.changeLeadOwner( component, helper, lead.Record_Id__c, index );
    }
})