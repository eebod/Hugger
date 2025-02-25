const API_KEY = '<Provide Your API KEY>';
const API_PROVIDER_URL = 'https://rapidapi.com/rockapis-rockapis-default/api/linkedin-data-api'; // Provides free 50 calls per month || Can also be paired with other similar provider on the rapidapi platform, to maximize free tier usage.

async function doPost(e) {
    try {
      // Parse the POST data
      var postData = JSON.parse(e.postData.contents);
      
      // Process the data
      const profileData = await makePostRequest(postData.url);
      appendToSheet(profileData, postData.url);
      
      // Return a success response
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data received successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
    } catch(error) {
      // Return an error response
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  async function makePostRequest(urldata) {
    // URL to send the request to
    const url = `https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url?url=${urldata}`;
    
    // Request parameters
    var params = {
      'method': 'GET',
      'headers': {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
      },
      'muteHttpExceptions': true
    };
    
    try {
      // Make the request
      const response = UrlFetchApp.fetch(url, params);
      
      // Get response content
      const responseContent = response.getContentText();
      
      // Parse JSON response
      if (responseContent) {
        return JSON.parse(responseContent);
  
      }
      throw new Error('Fetch failed')
    } catch(error) {
      Logger.log('Error making POST request: ' + error);
      throw error;
    }
  }
  
  function appendToSheet(data, url){
    // Get the active spreadsheet
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
    // Create data arrival date
    let arrivalDate =  Utilities.formatDate(new Date(), 'WAT', 'dd.MM.yyyy');
  
    const databox = [];
  
    databox.push(data.profilePicture || '-')
    databox.push(data.firstName || '-' );
    databox.push(data.lastName || '-' );
    databox.push(data.headline || '-' );
    databox.push(data.geo?.full || '-');
    
    
    databox.push( data.educations[0] ? `${data.educations[0].grade ? data.educations[0].grade+' ' : ''}${data.educations[0].degree ? data.educations[0].degree+' ' : ''}${data.educations[0].fieldOfStudy ? data.educations[0].fieldOfStudy+' ' : ''}${ data.educations[0].schoolName ? data.educations[0].schoolName+' ' : ''}` : `-`);
    
    databox.push( data.educations[1] ? `${data.educations[1].grade ? data.educations[0].grade+' ' : ''}${data.educations[1].degree ? data.educations[1].degree+' ' : ''}${data.educations[1].fieldOfStudy ? data.educations[1].fieldOfStudy+' ' : ''}${ data.educations[1].schoolName ? data.educations[1].schoolName+' ' : ''}` : `-`);
  
  
    databox.push( data.fullPositions[0] ? `${data.fullPositions[0].title ? data.fullPositions[0].title+' ' : ''}${data.fullPositions[0].companyName ? 'at '+data.fullPositions[0].companyName+', ' : ''}${data.fullPositions[0].location ? data.fullPositions[0].location+'.' : ''}` : `-`);
  
    databox.push( data.fullPositions[1] ? `${data.fullPositions[1].title ? data.fullPositions[1].title+' ' : ''}${data.fullPositions[1].companyName ? 'at '+data.fullPositions[1].companyName+', ' : ''}${data.fullPositions[1].location ? data.fullPositions[1].location+'.' : ''}` : `-`);
  
    databox.push( data.fullPositions[2] ? `${data.fullPositions[2].title ? data.fullPositions[2].title+' ' : ''}${data.fullPositions[2].companyName ? 'at '+data.fullPositions[2].companyName+', ' : ''}${data.fullPositions[2].location ? data.fullPositions[2].location+'.' : ''}` : `-`);
  
    databox.push( data.certifications[0] ? `${data.certifications[0].name ? data.certifications[0].name+' ' : ''}${data.certifications[0].authority ? 'from '+data.certifications[0].authority+'.' : ''}` : `-`);
  
    databox.push( data.certifications[1] ? `${data.certifications[1].name ? data.certifications[1].name+' ' : ''}${data.certifications[1].authority ? 'from '+data.certifications[1].authority+'.' : ''}` : `-`);
  
    
    databox.push(data.skills[0]?.name || '-');
    databox.push(data.skills[1]?.name || '-');
    databox.push(data.skills[2]?.name || '-');
  
  
    databox.push(url);
    databox.push(arrivalDate);
  
    // Append the email to the active sheet
    sheet.appendRow(databox);
  
    // Get the last row that was just added
    const lastRow = sheet.getLastRow();
    
    // Apply the IMAGE formula to the cell if there's an image URL
    if (data.profilePicture) {
      // Replace the URL with the IMAGE function
      sheet.getRange(lastRow, 1).setFormula(`=IMAGE("${data.profilePicture}")`);
    }
  }