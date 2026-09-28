/**
 * Official BIT Special Labs & Coordinators Directory
 * Source: BIT Wiki (https://wiki.bitsathy.ac.in/wiki/SLABS:Special_labs)
 */

export const SPECIAL_LAB_CLUSTERS = [
  { id: 'ALL', label: 'All Special Labs' },
  { id: 'COMPUTING', label: 'AI & Software' },
  { id: 'ELECTRONICS', label: 'Electronics & IoT' },
  { id: 'MECHANICAL', label: 'Mechanical & Automation' },
  { id: 'BIOTECH_AGRI', label: 'Bio & Agriculture' },
  { id: 'CIVIL_FASHION', label: 'Civil, Fashion & Food' }
];

export const SPECIAL_LABS_LIST = [
  {
    id: 'manuf_fab',
    slNo: 1,
    name: 'MANUFACTURING & FABRICATION CELL',
    shortName: 'Manufacturing Cell',
    cluster: 'MECHANICAL',
    clusterLabel: 'Mechanical & Automation',
    tagline: 'Advanced Machining, CNC Fabrication, 3D Printing & Prototyping',
    description: 'Provides end-to-end industrial prototyping facilities, high-precision CNC milling, laser cutting, and additive manufacturing for student innovation projects and mechanical product engineering.',
    technologies: ['CNC Machining', '3D Printing (FDM/SLA)', 'Laser Cutting', 'Sheet Metal Fabrication', 'TIG/MIG Welding'],
    faculty: {
      name: 'Mr. Chandrasekaran M',
      designation: 'Faculty In-Charge',
      department: 'Mechanical Engineering',
      email: 'chandrasekaran@bitsathy.ac.in',
      phone: '9585496033',
      cabin: 'Mechanical Block - Ground Floor'
    },
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  },
  {
    id: 'robotics_auto',
    slNo: 2,
    name: 'ROBOTICS & AUTOMATION',
    shortName: 'Robotics Lab',
    cluster: 'MECHANICAL',
    clusterLabel: 'Mechanical & Automation',
    tagline: 'Autonomous Mobile Robots, Industrial Arms & ROS Frameworks',
    description: 'Focuses on designing and deploying intelligent robotics systems, multi-axis industrial robotic arms, autonomous navigation (SLAM), drone robotics, and ROS-powered automation.',
    technologies: ['Robot Operating System (ROS)', 'Industrial Robotic Arms', 'SLAM & LiDAR', 'Computer Vision (OpenCV)', 'Kinematics & Dynamics'],
    faculty: {
      name: 'Dr. Senthilkumar P',
      designation: 'Faculty In-Charge',
      department: 'Mechatronics / Mechanical',
      email: 'senthilkumarp@bitsathy.ac.in',
      phone: '7373562428',
      cabin: 'Mechatronics Block - 1st Floor'
    },
    color: 'indigo',
    badgeClass: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
  },
  {
    id: 'ai_industrial',
    slNo: 3,
    name: 'AI BASED INDUSTRIAL AUTOMATION',
    shortName: 'AI Industrial Auto',
    cluster: 'MECHANICAL',
    clusterLabel: 'Mechanical & Automation',
    tagline: 'Smart Factory, PLC/SCADA Integration & Edge AI for Industry 4.0',
    description: 'Integrates artificial intelligence with industrial automation hardware. Students work on PLC programming, SCADA interfaces, machine vision quality inspection, and predictive maintenance algorithms.',
    technologies: ['PLC & SCADA', 'Edge AI Vision', 'Industry 4.0 Protocols', 'Predictive Maintenance', 'Modbus / OPC-UA'],
    faculty: {
      name: 'Mr. Sivabalakrishnan R',
      designation: 'Faculty In-Charge',
      department: 'Electrical & Electronics',
      email: 'sivabalakrishnan@bitsathy.ac.in',
      phone: '9842581719',
      cabin: 'EEE Block - Ground Floor'
    },
    color: 'cyan',
    badgeClass: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
  },
  {
    id: 'hackathon_cell',
    slNo: 4,
    name: 'HACKATHON',
    shortName: 'Hackathon Cell',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'National & Global Ideathons, SIH Mentorship & Rapid Prototyping',
    description: 'The premier innovation hub driving BIT student participation in national hackathons (Smart India Hackathon, TN Innovate, Google Solution Challenge) with dedicated 24/7 product sprinting.',
    technologies: ['Rapid Prototyping', 'Full Stack Development', 'Pitching & Business Models', 'Hardware-Software Interfacing', 'AI Solutioning'],
    faculty: {
      name: 'Dr. Chinnadurrai C L',
      designation: 'Special Lab Coordinator',
      department: 'Center for Excellence',
      email: 'chinnadurraicl@bitsathy.ac.in',
      phone: '9600770944',
      cabin: 'Center for Excellence / Special Labs Wing'
    },
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  },
  {
    id: 'aquatech',
    slNo: 5,
    name: 'AQUATECH INNOVATION',
    shortName: 'Aquatech Lab',
    cluster: 'BIOTECH_AGRI',
    clusterLabel: 'Bio & Agriculture',
    tagline: 'Smart Water Treatment, IoT Quality Sensing & Desalination',
    description: 'Develops advanced technological solutions for water purification, recycling, automated effluent treatment plants (ETP), and smart IoT-based groundwater quality monitoring networks.',
    technologies: ['IoT Water Monitoring', 'Membrane Filtration', 'Solar Desalination', 'Wastewater Treatment', 'Sensors & Telemetry'],
    faculty: {
      name: 'Mr. Baranidharan V',
      designation: 'Faculty In-Charge',
      department: 'Civil / Environmental Engineering',
      email: 'baranidharan@bitsathy.ac.in',
      phone: '9487414010',
      cabin: 'Civil Engineering Block'
    },
    color: 'teal',
    badgeClass: 'bg-teal-500/10 text-teal-500 border-teal-500/20'
  },
  {
    id: 'sensors_tamil',
    slNo: 6,
    name: 'SENSORS AND TAMIL COMPUTING',
    shortName: 'Tamil Computing & Sensors',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'Tamil Natural Language Processing, Speech AI & Sensor Interfacing',
    description: 'Pioneers research in Tamil Natural Language Processing (NLP), Indic language large language models, text-to-speech synthesis, Optical Character Recognition (OCR), and specialized sensor analytics.',
    technologies: ['Tamil NLP & Transformers', 'Speech-to-Text & TTS', 'Tamil OCR', 'Sensor Signal Conditioning', 'Indic LLMs'],
    faculty: {
      name: 'Dr. Haritha J',
      designation: 'Faculty In-Charge',
      department: 'Information Technology',
      email: 'haritha@bitsathy.ac.in',
      phone: '9489221678',
      cabin: 'IT Block - 2nd Floor'
    },
    color: 'purple',
    badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  },
  {
    id: 'pcb_lab',
    slNo: 7,
    name: 'PRINTED CIRCUIT BOARD (PCB)',
    shortName: 'PCB Design Lab',
    cluster: 'ELECTRONICS',
    clusterLabel: 'Electronics & IoT',
    tagline: 'Multi-layer Circuit Design, Schematic Layout & SMD Fabrication',
    description: 'Equipped with professional CAD layout tools, etching tanks, UV exposure units, and SMD reflow ovens to enable students to design, route, fabricate, and test custom multi-layer electronic circuit boards.',
    technologies: ['KiCad & Altium Designer', 'Multi-Layer PCB Routing', 'SMD Soldering & Reflow', 'Signal Integrity Analysis', 'Hardware Debugging'],
    faculty: {
      name: 'Dr. Elango S',
      designation: 'Faculty In-Charge',
      department: 'Electronics & Communication',
      email: 'elangos@bitsathy.ac.in',
      phone: '9486417478',
      cabin: 'ECE Block - 1st Floor'
    },
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  {
    id: 'embedded_tech',
    slNo: 8,
    name: 'EMBEDDED TECHNOLOGY',
    shortName: 'Embedded Tech',
    cluster: 'ELECTRONICS',
    clusterLabel: 'Electronics & IoT',
    tagline: 'ARM Cortex, RTOS, Firmware Engineering & Microcontrollers',
    description: 'Specializes in firmware programming for microcontrollers, RTOS kernel customization, low-power battery-operated devices, and hardware-software co-design for consumer and automotive electronics.',
    technologies: ['ARM Cortex Architecture', 'FreeRTOS & Zephyr', 'Embedded C / C++', 'STM32 & ESP-IDF', 'Device Drivers'],
    faculty: {
      name: 'Dr. Daniel Raj A',
      designation: 'Faculty In-Charge',
      department: 'Electronics & Communication',
      email: 'danielraja@bitsathy.ac.in',
      phone: '9095061141',
      cabin: 'ECE Block - 2nd Floor'
    },
    color: 'blue',
    badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  {
    id: 'iot_lab',
    slNo: 9,
    name: 'IOT (INTERNET OF THINGS)',
    shortName: 'IoT Lab',
    cluster: 'ELECTRONICS',
    clusterLabel: 'Electronics & IoT',
    tagline: 'Smart Connected Devices, LoRaWAN, Cloud Gateways & Edge Nodes',
    description: 'Builds end-to-end IoT solutions across smart campus monitoring, wireless sensor mesh networks, industrial telemetry, LoRaWAN gateways, and real-time cloud data pipelines.',
    technologies: ['LoRaWAN & Zigbee', 'MQTT & CoAP', 'AWS IoT Core / Azure IoT', 'Edge Computing', 'Sensor Fusion'],
    faculty: {
      name: 'Dr. Manojkumar P',
      designation: 'Central Coordinator & Lab Head',
      department: 'Electronics & Instrumentation',
      email: 'manojkumarp@bitsathy.ac.in',
      phone: '9965466688',
      cabin: 'EIE Block / Special Labs Wing'
    },
    color: 'sky',
    badgeClass: 'bg-sky-500/10 text-sky-500 border-sky-500/20'
  },
  {
    id: 'elec_drives',
    slNo: 10,
    name: 'ELECTRICAL DRIVES',
    shortName: 'Electric Drives & EV',
    cluster: 'MECHANICAL',
    clusterLabel: 'Mechanical & Automation',
    tagline: 'Electric Vehicle Powertrains, BLDC Motor Controllers & BMS',
    description: 'Empowers students to design and test power electronic converters, battery management systems (BMS), regenerative braking, and closed-loop motor controllers for electric vehicles and renewable energy.',
    technologies: ['BLDC & PMSM Motor Control', 'Battery Management Systems (BMS)', 'Inverters & Converters', 'MATLAB/Simulink EV Modeling', 'High Voltage Safety'],
    faculty: {
      name: 'Mr. Alex Stanley Raja T',
      designation: 'Faculty In-Charge',
      department: 'Electrical & Electronics',
      email: 'alexstanleyraja@bitsathy.ac.in',
      phone: '9443322150',
      cabin: 'EEE Block - 1st Floor'
    },
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  },
  {
    id: 'ai_lab',
    slNo: 11,
    name: 'ARTIFICIAL INTELLIGENCE',
    shortName: 'AI & Deep Learning',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'Deep Neural Networks, Computer Vision, LLMs & Generative AI',
    description: 'Dedicated to machine learning, neural network architectures, generative diffusion models, fine-tuning LLMs, automated speech recognition, and GPU-accelerated computing pipelines.',
    technologies: ['PyTorch & TensorFlow', 'Large Language Models (LLMs)', 'Transformer Architectures', 'Computer Vision & YOLO', 'CUDA Acceleration'],
    faculty: {
      name: 'Mr. Pandiyan M',
      designation: 'Faculty In-Charge',
      department: 'Computer Science & Engineering',
      email: 'pandiyanm@bitsathy.ac.in',
      phone: '9597819678',
      cabin: 'CSE Block - 2nd Floor'
    },
    color: 'indigo',
    badgeClass: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
  },
  {
    id: 'data_science',
    slNo: 12,
    name: 'DATA SCIENCE',
    shortName: 'Data Science Lab',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'Big Data Analytics, Statistical Modeling & Business Intelligence',
    description: 'Prepares students for real-world enterprise analytics, large-scale data engineering with Apache Spark, automated feature pipelines, predictive modeling, and interactive BI dashboards.',
    technologies: ['Python & R for Data Science', 'Apache Spark & PySpark', 'Tableau & PowerBI', 'Statistical Inference', 'Time Series Forecasting'],
    faculty: {
      name: 'Dr. Karthiga M',
      designation: 'Faculty In-Charge',
      department: 'Computer Technology / AI&DS',
      email: 'karthigam@bitsathy.ac.in',
      phone: '9789483696',
      cabin: 'CT / AI&DS Block - 2nd Floor'
    },
    color: 'blue',
    badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  {
    id: 'fullstack_devops',
    slNo: 13,
    name: 'FULL STACK & DEVOPS',
    shortName: 'Full Stack & DevOps',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'Cloud Native Web Apps, Microservices, CI/CD & Kubernetes',
    description: 'Trains students on high-performance modern web architectures, scalable backend systems, container orchestration, automated continuous deployment pipelines, and cloud infrastructure.',
    technologies: ['React, Next.js, Node.js', 'Docker & Kubernetes', 'CI/CD (GitHub Actions)', 'PostgreSQL & MongoDB', 'Microservices Architecture'],
    faculty: {
      name: 'Dr. Sundara Murthy S',
      designation: 'Faculty In-Charge',
      department: 'Information Science & Engineering',
      email: 'sundaramurthys@bitsathy.ac.in',
      phone: '9942999966',
      cabin: 'ISE Block - 1st Floor'
    },
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  {
    id: 'cloud_cyber',
    slNo: 14,
    name: 'CLOUD & CYBER SECURITY',
    shortName: 'Cyber Security Lab',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'Ethical Hacking, Penetration Testing, SOC Defense & Cloud Architecture',
    description: 'Equipped with isolated cyber ranges, vulnerability scanning frameworks, SOC monitoring SIEM tools, and AWS/Azure/GCP cloud environments for hands-on defense and penetration testing.',
    technologies: ['Penetration Testing (Kali Linux)', 'SOC & SIEM Monitoring', 'AWS / Azure Cloud Security', 'Network Traffic Analysis (Wireshark)', 'Cryptography & Zero Trust'],
    faculty: {
      name: 'Mr. Maheshkumar K',
      designation: 'Faculty In-Charge',
      department: 'Information Technology',
      email: 'maheshkumar@bitsathy.ac.in',
      phone: '9789739764',
      cabin: 'IT Block - 1st Floor'
    },
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  },
  {
    id: 'xr_studio',
    slNo: 15,
    name: 'XR STUDIO',
    shortName: 'XR Studio (AR/VR)',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'Virtual Reality, Augmented Reality, 3D Spatial Computing & Unity',
    description: 'Equipped with Meta Quest headsets, HTC Vive rigs, motion capture sensors, and high-performance rendering workstations for spatial computing, game development, and medical/industrial simulation.',
    technologies: ['Unity 3D & Unreal Engine 5', 'Meta Quest / HTC Vive SDK', 'WebXR & Three.js', '3D Spatial Audio & Haptics', 'Blender 3D Modeling'],
    faculty: {
      name: 'Mr. Sathishkannan R',
      designation: 'Faculty In-Charge',
      department: 'Computer Science and Design',
      email: 'sathishkannanr@bitsathy.ac.in',
      phone: '9047973964',
      cabin: 'CSD Block - Ground Floor'
    },
    color: 'purple',
    badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  },
  {
    id: 'blockchain_tech',
    slNo: 16,
    name: 'BLOCKCHAIN TECHNOLOGY',
    shortName: 'Blockchain Lab',
    cluster: 'COMPUTING',
    clusterLabel: 'AI & Software',
    tagline: 'Smart Contracts, Decentralized Apps (DApps), Web3 & Zero-Knowledge',
    description: 'Explores decentralized ledgers, Ethereum EVM smart contracts, Solidity engineering, enterprise Hyperledger networks, decentralized identity (DID), and secure cryptographic protocol design.',
    technologies: ['Solidity & Ethereum EVM', 'Hardhat & Foundry', 'Web3.js & Ethers.js', 'Hyperledger Fabric', 'Zero-Knowledge Proofs'],
    faculty: {
      name: 'Ms. Priya L',
      designation: 'Faculty In-Charge',
      department: 'Computer Science & Engineering',
      email: 'priyal@bitsathy.ac.in',
      phone: '9486120099',
      cabin: 'CSE Block - 1st Floor'
    },
    color: 'teal',
    badgeClass: 'bg-teal-500/10 text-teal-500 border-teal-500/20'
  },
  {
    id: 'machine_building',
    slNo: 17,
    name: 'CENTRE FOR MACHINE BUILDING',
    shortName: 'Machine Building',
    cluster: 'MECHANICAL',
    clusterLabel: 'Mechanical & Automation',
    tagline: 'Special Purpose Machines (SPM), Mechanical Simulation & Heavy CAD',
    description: 'Focuses on conceptualizing, designing, and fabricating custom Special Purpose Machines (SPM) for industrial automation, agricultural mechanization, and automated packaging lines.',
    technologies: ['SolidWorks & CATIA', 'Finite Element Analysis (FEA)', 'Pneumatics & Hydraulics', 'Special Purpose Machine (SPM) Design', 'Structural Rigidity Analysis'],
    faculty: {
      name: 'Dr. Vadivel Vivek V',
      designation: 'Faculty In-Charge',
      department: 'Mechanical Engineering',
      email: 'vadivelvivek@bitsathy.ac.in',
      phone: '9952562584',
      cabin: 'Mechanical Block - 2nd Floor'
    },
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  },
  {
    id: 'bioprospecting',
    slNo: 18,
    name: 'BIOPROSPECTING CELL',
    shortName: 'Bioprospecting Cell',
    cluster: 'BIOTECH_AGRI',
    clusterLabel: 'Bio & Agriculture',
    tagline: 'Natural Product Screening, Phytochemistry & Microbial Therapeutics',
    description: 'Researches herbal extracts, bioactive medicinal compounds, antimicrobial peptides, and therapeutic characterization using HPLC, spectrophotometry, and cell culture testing.',
    technologies: ['Phytochemical Extraction', 'HPLC & Chromatography', 'Antimicrobial Screening', 'Microbial Culturing', 'Spectrophotometry'],
    faculty: {
      name: 'Mr. Rajaseetharama S',
      designation: 'Faculty In-Charge',
      department: 'Biotechnology',
      email: 'rajaseetharama@bitsathy.ac.in',
      phone: '9994208375',
      cabin: 'Biotech Block - 1st Floor'
    },
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  {
    id: 'bioproduct_innov',
    slNo: 19,
    name: 'BIOPRODUCT INNOVATION CELL',
    shortName: 'Bioproduct Innovation',
    cluster: 'BIOTECH_AGRI',
    clusterLabel: 'Bio & Agriculture',
    tagline: 'Biopolymers, Biofuels, Agri-Waste Upcycling & Fermentation Tech',
    description: 'Develops circular bioeconomy innovations, biodegradable plastics from agricultural residues, microbial fermentation enzymes, bio-fertilizers, and sustainable biochemical synthesis.',
    technologies: ['Biopolymer Synthesis', 'Bioreactor Fermentation', 'Agri-Waste valorization', 'Enzymatic Hydrolysis', 'Downstream Processing'],
    faculty: {
      name: 'Mr. Balaji S',
      designation: 'Faculty In-Charge',
      department: 'Biotechnology',
      email: 'balajisadhasivam@bitsathy.ac.in',
      phone: '9944266097',
      cabin: 'Biotech Block - Ground Floor'
    },
    color: 'teal',
    badgeClass: 'bg-teal-500/10 text-teal-500 border-teal-500/20'
  },
  {
    id: 'smart_agri',
    slNo: 20,
    name: 'SMART AGRICULTURE',
    shortName: 'Smart Agriculture',
    cluster: 'BIOTECH_AGRI',
    clusterLabel: 'Bio & Agriculture',
    tagline: 'Precision Farming, Autonomous Drone Scouting & Smart Greenhouses',
    description: 'Combines agricultural engineering with IoT and drone telemetry. Focuses on automated drip fertigation, soil nitrogen-phosphorus-potassium (NPK) sensors, and crop pest detection algorithms.',
    technologies: ['Agri Drones & Multispectral Imaging', 'NPK Soil Sensing', 'Automated Fertigation', 'Greenhouse Climate Control', 'Yield Prediction AI'],
    faculty: {
      name: 'Mr. Muthukumaravel K',
      designation: 'Faculty In-Charge',
      department: 'Agricultural Engineering',
      email: 'muthukumaravelk@bitsathy.ac.in',
      phone: '9443414794',
      cabin: 'Agriculture Block - Ground Floor'
    },
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  {
    id: 'sustainable_civil',
    slNo: 21,
    name: 'SUSTAINABLE CIVIL',
    shortName: 'Sustainable Civil',
    cluster: 'CIVIL_FASHION',
    clusterLabel: 'Civil, Fashion & Food',
    tagline: 'Low-Carbon Concrete, Smart City Infrastructure & Structural Health',
    description: 'Innovates in green building materials, geopolymer concrete, waste-recycled aggregate construction, earthquake vibration damping, and sensor-based bridge/building structural health monitoring.',
    technologies: ['Geopolymer & Low-Carbon Concrete', 'Structural Health Sensors', 'BIM (Building Information Modeling)', 'GIS Spatial Mapping', 'Non-Destructive Testing (NDT)'],
    faculty: {
      name: 'Dr. Karthiga Shenbagam N',
      designation: 'Faculty In-Charge',
      department: 'Civil Engineering',
      email: 'karthigashenbagamn@bitsathy.ac.in',
      phone: '8220835569',
      cabin: 'Civil Engineering Block - 1st Floor'
    },
    color: 'cyan',
    badgeClass: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
  },
  {
    id: 'fiber_fashion',
    slNo: 22,
    name: 'FIBER TO FASHION',
    shortName: 'Fiber to Fashion',
    cluster: 'CIVIL_FASHION',
    clusterLabel: 'Civil, Fashion & Food',
    tagline: 'Smart Wearables, Sustainable Fibers, CAD Apparel & Fashion Tech',
    description: 'Bridges textile science with modern technology. Students explore electronic smart textiles (e-textiles), natural antimicrobial fabric coatings, 3D garment simulation, and eco-friendly dye processes.',
    technologies: ['E-Textiles & Wearable Circuits', '3D Apparel CAD (Clo3D)', 'Natural Dyeing & Finishing', 'Technical Textile Testing', 'Sustainable Garment Prototyping'],
    faculty: {
      name: 'Ms. Mekala N',
      designation: 'Faculty In-Charge',
      department: 'Fashion Technology',
      email: 'mekalan@bitsathy.ac.in',
      phone: '9025970385',
      cabin: 'Fashion Technology Block'
    },
    color: 'purple',
    badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  },
  {
    id: 'food_innov',
    slNo: 23,
    name: 'FOOD INNOVATION',
    shortName: 'Food Innovation Lab',
    cluster: 'CIVIL_FASHION',
    clusterLabel: 'Civil, Fashion & Food',
    tagline: 'Novel Food Formulation, Shelf-Life Extension & Quality Assurance',
    description: 'Develops novel functional foods, bioactive fortified beverages, sustainable bio-packaging, non-thermal food processing, and analytical safety validation adhering to FSSAI standards.',
    technologies: ['Functional Food Formulation', 'Freeze Drying & Dehydration', 'Bioactive Food Packaging', 'Sensory & Texture Analysis', 'Food Safety & Shelf-life Modeling'],
    faculty: {
      name: 'Dr. Arunasree T N A',
      designation: 'Faculty In-Charge',
      department: 'Food Technology',
      email: 'arunasreetna@bitsathy.ac.in',
      phone: '8870981032',
      cabin: 'Food Technology Block - Ground Floor'
    },
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  }
];

export const SPECIAL_LAB_CENTRAL_COORDINATORS = [
  {
    id: 'coord_1',
    name: 'Dr. Manojkumar P',
    role: 'Central Special Lab Coordinator',
    department: 'Electronics & Instrumentation',
    email: 'manojkumarp@bitsathy.ac.in',
    phone: '9965466688',
    responsibilities: 'IoT, Electronics, Embedded Systems & Hardware Clusters'
  },
  {
    id: 'coord_2',
    name: 'Dr. Chinnadurrai C L',
    role: 'Central Special Lab Coordinator',
    department: 'Center for Excellence',
    email: 'chinnadurraicl@bitsathy.ac.in',
    phone: '9600770944',
    responsibilities: 'Hackathons, Competitions, AI & Software Clusters'
  },
  {
    id: 'coord_3',
    name: 'Mr. Sathyaprabhu A',
    role: 'Central Special Lab Coordinator',
    department: 'Center for Excellence / IT',
    email: 'in7111@bitsathy.ac.in',
    phone: '8056550373',
    responsibilities: 'Student Special Lab Enrollments & BIP Project Reviews'
  },
  {
    id: 'coord_4',
    name: 'Mrs. Pradeeksha V',
    role: 'Central Special Lab Coordinator',
    department: 'Center for Excellence',
    email: 'pradeekshav@bitsathy.ac.in',
    phone: '9789029137',
    responsibilities: 'Student Special Lab Reviews, Attendance & Verification'
  }
];
