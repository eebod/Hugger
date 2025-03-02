const API_KEY = '<Provide Your API KEY>';
const API_PROVIDER_URL = 'https://rapidapi.com/rockapis-rockapis-default/api/linkedin-data-api'; // Provides free 50 calls per month || Can also be paired with other similar provider on the rapidapi platform, to maximize free tier usage.

aasync function doPost(e) {
  try {
    // Parse the POST data
    const postData = JSON.parse(e.postData.contents);
    
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
    // Log the error for debugging
    Logger.log(`Error in doPost: ${error.toString()}`);
    
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
  const url = `https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(urldata)}`;
  
  // Request parameters
  const params = {
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
    
    // Check HTTP status code
    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      throw new Error(`HTTP request failed with status code: ${responseCode}`);
    }
    
    // Get and parse response content
    const responseContent = response.getContentText();
    if (!responseContent) {
      throw new Error('Empty response received');
    }
    
    return JSON.parse(responseContent);
  } catch(error) {
    Logger.log(`Error making API request: ${error}`);
    throw error;
  }
}

function appendToSheet(data, url) {
  // Get the active spreadsheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Create data arrival date
  const arrivalDate = Utilities.formatDate(new Date(), 'WAT', 'dd.MM.yyyy');

  // Helper function to safely get data from nested objects
  const safeGet = (obj, path, defaultValue = '-') => {
    try {
      const keys = path.split('.');
      let result = obj;
      
      for (const key of keys) {
        if (result === null || result === undefined || typeof result !== 'object') {
          return defaultValue;
        }
        result = result[key];
      }
      
      return result || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };
  
  // Helper function to format education/position/certification entries
  const formatEducation = (edu) => {
    if (!edu) return '-';
    
    return [
      safeGet(edu, 'grade', ''),
      safeGet(edu, 'degree', ''),
      safeGet(edu, 'fieldOfStudy', ''),
      safeGet(edu, 'schoolName', '')
    ].filter(Boolean).join(' ') || '-';
  };
  
  const formatPosition = (pos) => {
    if (!pos) return '-';
    
    const title = safeGet(pos, 'title', '');
    const company = safeGet(pos, 'companyName') ? `at ${safeGet(pos, 'companyName')}` : '';
    const location = safeGet(pos, 'location') ? `${safeGet(pos, 'location')}` : '';
    
    return [title, company, location].filter(Boolean).join(', ') || '-';
  };
  
  const formatCertification = (cert) => {
    if (!cert) return '-';
    
    const name = safeGet(cert, 'name', '');
    const authority = safeGet(cert, 'authority') ? `from ${safeGet(cert, 'authority')}` : '';
    
    return [name, authority].filter(Boolean).join(' ') || '-';
  };
  
  // Prepare the data row
  const dataRow = [
    safeGet(data, 'profilePicture'),
    safeGet(data, 'firstName'),
    safeGet(data, 'lastName'),
    safeGet(data, 'headline'),
    safeGet(data, 'geo.full'),
    
    formatEducation(safeGet(data, 'educations.0', null)),
    
    formatPosition(safeGet(data, 'fullPositions.0', null)),
    formatPosition(safeGet(data, 'fullPositions.1', null)),
    formatPosition(safeGet(data, 'fullPositions.2', null)),
    
    formatCertification(safeGet(data, 'certifications.0', null)),
    formatCertification(safeGet(data, 'certifications.1', null)),
    
    safeGet(data, 'skills.0.name'),
    safeGet(data, 'skills.1.name'),
    safeGet(data, 'skills.2.name'),
    
    url,
    arrivalDate
  ];

  // Append the data row to the active sheet
  sheet.appendRow(dataRow);

  // Get the last row that was just added
  const lastRow = sheet.getLastRow();
  
  // Apply the IMAGE formula to the cell if there's an image URL
  const profilePicture = safeGet(data, 'profilePicture', null);
  if (profilePicture && profilePicture !== '-') {
    // Replace the URL with the IMAGE function
    sheet.getRange(lastRow, 1).setFormula(`=IMAGE("${profilePicture}")`);
  }
}