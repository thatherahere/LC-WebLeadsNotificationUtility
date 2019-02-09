# Small Utility Lightning Component for Web To Lead Notifications

**Business Use Case:**
> As soon as Visitor submit a Web to lead, All Sales Reps should get Notification in Sales & Sales Console App Utility bar.

**Solution:**
> A small lightning component using Platform Event, Lightning empAPI component, Lightning Data Service and allowing Reps to Accept or Decline the incoming leads as soon as they are in the system.

<img src="https://github.com/thatherahere/LC-WebLeadsNotificationUtility/blob/master/demo.png"/>

## Table of Contents
- [Installing using Salesforce DX](#installing-using-salesforce-dx)
- [Explore the application](#explore-the-application)
- [Features](#features)


## Installing using Salesforce DX

1. Set up your environment. The steps include:

    - [Sign up for a Developer org](https://www.salesforce.com/form/signup/prerelease-spring19/) and enable Dev Hub functionality
    - Install the Salesforce CLI
    - Install Visual Studio Code
    - Install the Visual Studio Code Salesforce Extension Pack

1. If you have already done so, authenticate with your developer org and provide it with an alias (devhub):

    ```
    sfdx force:auth:web:login -d -a web2leadDev
    ```

1. Clone the repository:

    ```
    git clone https://github.com/thatherahere/LC-WebLeadsNotificationUtility
    cd LC-WebLeadsNotificationUtility
    ```

1. Create a scratch org and provide it an alias (LC-leadutility in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a LCleadutility
    ```

1. Push the app to your scratch org:

    ```
    sfdx force:source:push
    ```

1. Assign the permission set to the default user for permission on Push Topic object and Custom field on lead object:
    ```
    sfdx force:user:permset:assign -n Web2Lead_Custom_Permissions
    ```

1. Open the scratch org:

    ```
    sfdx force:org:open
    ```

1. Add and Activate Lightning component in Lightning Sales App:
    - In Setup, navigate to App Manager.
    - Click Edit in the dropdown menu next to Lightning Sales app.
    - Click the Utility Items tab and add the "Web Leads" from custom components.
    - Check Start automatically checkbox and Save it.

1. Add Users to "Web Lead Queue" queue:
    - In Setup, navigate to Queues.
    - Click Edit for "Web Lead Queue".
    - Scroll down to Queue Members and add default user and other users to Selected Members.

1. Get your Organization Id:
    - In Setup, navigate to Company Information
    - Copy "Salesforce.com Organization ID" from this page. We will use it in next few steps.

1. Make sure that Lead Source field on Lead object has "Web" as an active value.

## Explore the application
1. In App Launcher, select the Sales app.
2. At bottom in Utility bar you will see "Web Leads".
4. Go To [https://sampleweblead-developer-edition.gus.force.com](https://sampleweblead-developer-edition.gus.force.com), enter your scratch org Id, complete all required fields and Submit the form.
5. On submit, User will receive notifiction about the new lead with a sound.

<img src="https://github.com/thatherahere/LC-WebLeadsNotificationUtility/blob/master/Notification.png"/>


- Notes:
    1.  [https://sampleweblead-developer-edition.gus.force.com](https://sampleweblead-developer-edition.gus.force.com) is a Web to Lead form hosted on a public site in my developer org. This form never save your organization id. It request the organization Id just to redirect lead to your org.
    1. If you are testing with a Developer org, set "Testing with Scratch Org Or Sandbox?" to "No" to receive web to leads.

## Features
1. Platform Events
1. Lightning Console APIs & Navigation Methods
1. Lightning Data Service & [Lightning:empAPI component](https://developer.salesforce.com/docs/component-library/bundle/lightning:empApi/documentation)
1. NO APEX
1. User can accept or Decline the lead.
1. Only one user can accept the lead. On accept, Lead will be disappeared from other users. 
1. If Multiple users try to accept the same lead. User accepted the lead first, will own the lead. Other user will receive "You are late. This lead has already taken by someone else." toast to eat :neckbeard:. 
1. Have fun exploring!