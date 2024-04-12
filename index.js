const fs = require('fs');
const path = require('path');
const { formatISO, subDays, format } = require('date-fns');
// Configuration
const maxFiles = 100000; // Maximum number of files to generate

// Helper function to generate random date within the last 30 days
const generateRandomDate = () => {
  const daysAgo = Math.floor(Math.random() * 30);
  return formatISO(subDays(new Date(), daysAgo), {
    representation: 'complete',
  });
};

// Helper function to generate a random item from an array
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Task configurations
const tasks = [
  { eventName: 'capacity', eventType: 'entry', region: 'walkway' },
  { eventName: 'dwell', eventType: ['enter', 'exit'], region: 'store_front' },
  { eventName: 'capacity', eventType: 'entry', region: 'entrance' },
  {
    eventName: 'dwell',
    eventType: ['enter', 'exit'],
    region: ['shelf_1', 'shelf_2', 'shelf_3'],
  }, // Handling multiple shelves
  { eventName: 'visit', eventType: 'exit', region: 'in_store' },
];

let fileNumber = 2385; // Initialize the file number for unique file naming
let totalFilesGenerated = 0; // Track the total number of files generated

const generateRandomEventTrafficMessage = () => {
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  const eventType = Array.isArray(task.eventType)
    ? getRandomItem(task.eventType)
    : task.eventType;
  const region = Array.isArray(task.region)
    ? getRandomItem(task.region)
    : task.region;

  const eventData = {
    date_time: generateRandomDate(),
    store_code: 'SG-001',
    uuid: `uuid-${Math.random().toString(36).substring(2, 15)}`,
    tracker_id: `id-${Math.random().toString(36).substring(2, 9)}`,
    event_type: eventType,
    event_name: task.eventName,
    duration:
      eventType === 'exit' || task.eventName === 'dwell'
        ? Math.floor(Math.random() * 300) + 1
        : 0,
    class_type: 'customer',
    camera_name: `cam${Math.floor(Math.random() * 3) + 1}`,
    region: region,
    message: '',
    region_id: region.replace(/\s+/g, '_'),
    zone_name: '',
  };

  // Adding count only for capacity events
  if (task.eventName === 'capacity') {
    eventData.count = Math.floor(Math.random() * 100) + 1;
  }

  return JSON.stringify(eventData);
};

// Helper function to format the current date and time
const getCurrentFormattedTime = () => {
  return format(new Date(), 'yy-MM-dd-HH-mm-ss'); // using date-fns format function
};

// Generates files with the event traffic data
const generateFile = () => {
  if (totalFilesGenerated >= maxFiles) {
    console.log('Maximum number of files generated. Stopping.');
    return; // Stop generating files if the max limit is reached
  }

  // const fileNameOption = ['dwell', 'capacity', 'visit'][
  //   Math.floor(Math.random() * 3)
  // ];

  const currentTime = getCurrentFormattedTime();
  const fileName = `${fileNumber}-${currentTime}.json`; // New filename format

  const filePath = path.join(
    'C:',
    'projects',
    'hendricks',
    'experiment',
    'event-traffic-mock-data',
    'backup',
    fileName
    // `event-traffic-${fileNameOption}-${fileNumber}.json`
  );

  const fileContent = generateRandomEventTrafficMessage();

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`${fileName}`);
      fileNumber++; // Increment the file number for the next file
      totalFilesGenerated++; // Increment the total number of files generated
    }
  });
};

// Function to generate between 5 to 10 files randomly within each second
// const generateFilesPerSecond = () => {
//   const filesCount = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
//   for (let i = 0; i < filesCount; i++) {
//     const delay = Math.floor(Math.random() * 1000); // Random delay within the second (0-1000 milliseconds)
//     setTimeout(generateFile, delay);
//   }
// };

// Function to generate exactly 100 files each second
const generateFilesPerSecond = () => {
  for (let i = 0; i < 20; i++) {
    // Fixed number of files per second
    const delay = Math.floor(Math.random() * 1000); // Random delay within the second (0-1000 milliseconds)
    setTimeout(generateFile, delay);
  }
};

// Start generating files
setInterval(generateFilesPerSecond, 1000); // Call generateFile
