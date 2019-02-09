({
	onInit : function( component, event, helper ) {
		// Get the empApi component.
        var empApi = component.find("empApi");
        // Get the channel.
        var channel = "/event/"+component.get("v.eventName");
        var replayId = -1;
        
        // Callback function to be passed in the subscribe call.
        // After an event is received, this callback prints the event
        // payload to the console.
        var callback = function (message) {
            // Add list to existing list to display it to the agent. 
            // You may have your custom logic here to have more filters on lead
            // visibility and lead distribution.
            console.log(JSON.stringify( message.data.payload ) );
            var lead = message.data.payload;
            if( lead.Owner_Type__c == 'Queue' ){ 
                var newLeads = [lead];
                var existingLeads = component.get("v.lstLead");
                Array.prototype.push.apply(newLeads, existingLeads);
                console.log(JSON.stringify( newLeads ) );
                for( var i = 0; i<newLeads.length; i++ ){
                    newLeads[i].index = i;
                }
                component.set("v.lstLead", newLeads);
                document.getElementById("notificationAudio").play();
                this.openNotificationUtility( component, event, helper );
            }else{
                // As the lead is now assigned to a user, so remove it 
                // from the utility of all users.
                var existingLeads = component.get("v.lstLead");
                var assignedLeadIndex = -1;
                for( var i = 0; i<existingLeads.length; i++ ){
                    if( existingLeads[i].Record_Id__c == lead.Record_Id__c ){
                  		assignedLeadIndex = i;
                        break;
                    }
                }
                if( assignedLeadIndex != -1 ){
                    this.removeLead( component, assignedLeadIndex );
                }
            }
        }.bind(this);
        
        // Error handler function that prints the error to the console.
        var errorHandler = function (message) {
            console.log("Received error ", JSON.stringify( message ) ); 
        }.bind(this);
        
        // Register error listener and pass in the error handler function.
        empApi.onError(errorHandler);
        
        var sub;
        // Subscribe to the channel and save the returned subscription object.
        empApi.subscribe(channel, replayId, callback).then(function(value) {
            console.log("Subscribed to channel " + channel);
            console.log("Subscribed to value " + JSON.stringify(value) );
            sub = value;
            component.set("v.sub", sub); 
        });
    },
    changeLeadOwner : function( component, helper, leadId, index ){
        component.set("v.recordId", leadId );
        component.find("editLeadRecordData").reloadRecord(false, $A.getCallback(function() {
            var ownerId = component.get( "v.leadObj.OwnerId");
            if( ownerId && ownerId.substr(0,3) != '005' ){
                // Change lead owner to current user as he/she accepted the lead
                component.set( "v.leadObj.OwnerId", $A.get("$SObjectType.CurrentUser.Id") );
                //component.set( "v.leadObj.Is_Assigned__c", true );
                // Save the record using force recordData service.
                component.find("editLeadRecordData").saveRecord($A.getCallback(function(saveResult){
                    if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                        // Open accepted lead record as it is ready to work on
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({"recordId": leadId});
                        navEvt.fire();
                        // Remove list from list as user accepted it
                        helper.removeLead( component, index );
                    } else if (saveResult.state === "INCOMPLETE") {
                        console.log("User is offline, device doesn't support drafts.");
                    } else if (saveResult.state === "ERROR") {
                        console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
                        if( saveResult.error && saveResult.error[0].pageErrors[0].statusCode == "INSUFFICIENT_ACCESS_OR_READONLY" ){
                            component.find('notifLib').showToast({
                                "title": "Error!",
                                "type": "error",
                                "message": "You are late. This lead has already taken by someone else."
                            });
                        }
                    } else {
                        console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                    }
                }));
            }else{
                component.find('notifLib').showToast({
                    "title": "Error!",
                    "type": "error",
                    "message": "You are late. This lead has already taken by someone else."
                });
                
                // Remove list from list as user accepted it
        		helper.removeLead( component, index );
            }
        }));
    },
    // Open utility item for new leads
    openNotificationUtility : function( component, event, helper ){
        var utilityId = component.get( "v.utilityId");
        var utilityAPI = component.find("utilitybar");
        if( utilityId ){
            utilityAPI.openUtility({
                utilityId: component.get( "v.utilityId" )
            });
        }else{
            utilityAPI.getAllUtilityInfo().then(function(response) {
                response.forEach( function( utilityObj ){
                    if( utilityObj.utilityLabel == "Web Leads"){
                        component.set( "v.utilityId", utilityObj.id );
                        utilityAPI.openUtility({
                            utilityId: utilityObj.id
                        });
                    }
                });
            }).catch(function(error) {
                console.log(error);
            });
        }
    },
    removeLead : function( component, index ){
		var lstLead = component.get("v.lstLead");
        lstLead.splice(index, 1);
        // reorder list items index
        for( var i = 0; i<lstLead.length; i++ ){
            lstLead[i].index = i;
        }
        component.set("v.lstLead", lstLead);        
    }
})