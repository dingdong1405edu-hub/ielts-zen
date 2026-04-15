import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ─── Vocabulary Lessons (10 lessons) ─────────────────────────────
  const vocabLessons = [
    {
      id: 'vocab-1',
      section: 'vocabulary', band: 5.0, title: 'Environment – Core Vocabulary', topic: 'Environment',
      order: 1, xpReward: 10,
      content: {
        words: [
          { word: 'pollution', phonetic: '/pəˈluːʃn/', definition: 'Harmful substances contaminating the environment', vietnamese: 'ô nhiễm', example: 'Air pollution is a serious problem in many cities.' },
          { word: 'deforestation', phonetic: '/diːˌfɒrɪˈsteɪʃn/', definition: 'Large-scale clearing of forests', vietnamese: 'phá rừng', example: 'Deforestation in the Amazon threatens biodiversity.' },
          { word: 'recycle', phonetic: '/ˌriːˈsaɪkl/', definition: 'To process materials for reuse', vietnamese: 'tái chế', example: 'We should recycle glass and plastic to reduce waste.' },
          { word: 'habitat', phonetic: '/ˈhæbɪtæt/', definition: 'Natural environment where animals or plants live', vietnamese: 'môi trường sống', example: 'The panda\'s natural habitat is the bamboo forest.' },
          { word: 'renewable', phonetic: '/rɪˈnjuːəbl/', definition: 'Able to be naturally replaced or replenished', vietnamese: 'tái tạo được', example: 'Solar energy is a renewable source of power.' },
          { word: 'emission', phonetic: '/ɪˈmɪʃn/', definition: 'The release of gas or other substances into the air', vietnamese: 'khí thải', example: 'Carbon emissions from cars contribute to global warming.' },
          { word: 'sustainable', phonetic: '/səˈsteɪnəbl/', definition: 'Able to be maintained without harming the environment', vietnamese: 'bền vững', example: 'We need more sustainable farming practices.' },
          { word: 'conservation', phonetic: '/ˌkɒnsəˈveɪʃn/', definition: 'Protection of the natural environment', vietnamese: 'bảo tồn', example: 'Wildlife conservation helps endangered species survive.' },
        ],
      },
    },
    {
      id: 'vocab-2',
      section: 'vocabulary', band: 5.5, title: 'Technology & Innovation', topic: 'Technology',
      order: 2, xpReward: 12,
      content: {
        words: [
          { word: 'innovation', phonetic: '/ˌɪnəˈveɪʃn/', definition: 'The introduction of new ideas or methods', vietnamese: 'đổi mới sáng tạo', example: 'Technological innovation drives economic growth.' },
          { word: 'artificial intelligence', phonetic: '/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/', definition: 'Computer systems performing tasks requiring human intelligence', vietnamese: 'trí tuệ nhân tạo', example: 'Artificial intelligence is transforming many industries.' },
          { word: 'automation', phonetic: '/ˌɔːtəˈmeɪʃn/', definition: 'Using machines to do work previously done by humans', vietnamese: 'tự động hóa', example: 'Automation has displaced many factory workers.' },
          { word: 'cybersecurity', phonetic: '/ˌsaɪbəsɪˈkjʊərɪti/', definition: 'Protection of systems from digital attacks', vietnamese: 'an ninh mạng', example: 'Cybersecurity threats are increasing globally.' },
          { word: 'digital divide', phonetic: '/ˈdɪdʒɪtl dɪˈvaɪd/', definition: 'Gap between those with and without technology access', vietnamese: 'phân chia kỹ thuật số', example: 'The digital divide remains a challenge in developing countries.' },
          { word: 'algorithm', phonetic: '/ˈælɡərɪðəm/', definition: 'A set of rules for solving a problem', vietnamese: 'thuật toán', example: 'Search engines use complex algorithms to rank results.' },
          { word: 'surveillance', phonetic: '/səˈveɪləns/', definition: 'Close observation or monitoring', vietnamese: 'giám sát', example: 'Digital surveillance raises serious privacy concerns.' },
          { word: 'obsolete', phonetic: '/ˈɒbsəliːt/', definition: 'No longer used or needed; out of date', vietnamese: 'lỗi thời', example: 'Some traditional skills are becoming obsolete.' },
        ],
      },
    },
    {
      id: 'vocab-3',
      section: 'vocabulary', band: 6.0, title: 'Health & Wellbeing', topic: 'Health',
      order: 3, xpReward: 14,
      content: {
        words: [
          { word: 'prevalence', phonetic: '/ˈprevələns/', definition: 'The fact of being common or widespread', vietnamese: 'tỷ lệ phổ biến', example: 'The prevalence of obesity has increased dramatically.' },
          { word: 'sedentary', phonetic: '/ˈsedntri/', definition: 'Spending a lot of time sitting or inactive', vietnamese: 'ít vận động', example: 'A sedentary lifestyle increases heart disease risk.' },
          { word: 'malnutrition', phonetic: '/ˌmælnjuːˈtrɪʃn/', definition: 'Lack of proper nutrition', vietnamese: 'suy dinh dưỡng', example: 'Malnutrition affects millions of children in developing nations.' },
          { word: 'preventive', phonetic: '/prɪˈventɪv/', definition: 'Designed to stop something from happening', vietnamese: 'phòng ngừa', example: 'Preventive healthcare reduces the burden on hospitals.' },
          { word: 'pandemic', phonetic: '/pænˈdemɪk/', definition: 'A disease spreading across a whole country or world', vietnamese: 'đại dịch', example: 'The COVID-19 pandemic changed healthcare systems worldwide.' },
          { word: 'mortality', phonetic: '/mɔːˈtæləti/', definition: 'Death rate in a population', vietnamese: 'tỷ lệ tử vong', example: 'Child mortality rates have declined significantly over decades.' },
          { word: 'holistic', phonetic: '/həˈlɪstɪk/', definition: 'Treating the whole person rather than just symptoms', vietnamese: 'toàn diện', example: 'A holistic approach to health considers mental and physical wellbeing.' },
          { word: 'prognosis', phonetic: '/prɒɡˈnəʊsɪs/', definition: 'A forecast of how a disease will develop', vietnamese: 'tiên lượng', example: 'The patient\'s prognosis is positive with early treatment.' },
        ],
      },
    },
    {
      id: 'vocab-4',
      section: 'vocabulary', band: 6.5, title: 'Education Systems', topic: 'Education',
      order: 4, xpReward: 16,
      content: {
        words: [
          { word: 'pedagogy', phonetic: '/ˈpedəɡɒdʒi/', definition: 'The method and practice of teaching', vietnamese: 'phương pháp sư phạm', example: 'Modern pedagogy emphasizes student-centred learning.' },
          { word: 'curriculum', phonetic: '/kəˈrɪkjʊləm/', definition: 'The subjects comprising a course of study', vietnamese: 'chương trình giảng dạy', example: 'The national curriculum was revised to include digital literacy.' },
          { word: 'critical thinking', phonetic: '/ˈkrɪtɪkl ˈθɪŋkɪŋ/', definition: 'Objective analysis to form a judgement', vietnamese: 'tư duy phản biện', example: 'Universities aim to develop critical thinking in students.' },
          { word: 'vocational', phonetic: '/vəˈkeɪʃənl/', definition: 'Relating to skills for a specific occupation', vietnamese: 'hướng nghiệp', example: 'Vocational training provides practical skills for employment.' },
          { word: 'literacy', phonetic: '/ˈlɪtərəsi/', definition: 'The ability to read, write, or be competent in a field', vietnamese: 'năng lực đọc viết', example: 'Financial literacy should be taught in secondary schools.' },
          { word: 'tuition', phonetic: '/tjuːˈɪʃn/', definition: 'Teaching individually; fees charged by institutions', vietnamese: 'học phí / dạy kèm', example: 'University tuition fees have risen sharply in recent years.' },
          { word: 'meritocracy', phonetic: '/ˌmerɪˈtɒkrəsi/', definition: 'A system where advancement is based on ability', vietnamese: 'chế độ trọng tài năng', example: 'Education is seen as the foundation of a meritocracy.' },
          { word: 'retention', phonetic: '/rɪˈtenʃn/', definition: 'The ability to remember information learned', vietnamese: 'khả năng ghi nhớ', example: 'Active learning strategies improve knowledge retention.' },
        ],
      },
    },
    {
      id: 'vocab-5',
      section: 'vocabulary', band: 7.0, title: 'Business & Economics', topic: 'Business',
      order: 5, xpReward: 18,
      content: {
        words: [
          { word: 'entrepreneurship', phonetic: '/ˌɒntrəprəˈnɜːʃɪp/', definition: 'The activity of setting up and running a business', vietnamese: 'tinh thần khởi nghiệp', example: 'Entrepreneurship drives innovation and job creation.' },
          { word: 'austerity', phonetic: '/ɒˈsterɪti/', definition: 'Difficult conditions caused by reduced government spending', vietnamese: 'thắt lưng buộc bụng', example: 'Austerity measures led to widespread public protests.' },
          { word: 'fiscal', phonetic: '/ˈfɪskl/', definition: 'Relating to government revenue and expenditure', vietnamese: 'tài khóa', example: 'The government introduced new fiscal policies to reduce deficit.' },
          { word: 'monopoly', phonetic: '/məˈnɒpəli/', definition: 'Exclusive control of supply of a product', vietnamese: 'độc quyền', example: 'Tech monopolies have been criticised for stifling competition.' },
          { word: 'recession', phonetic: '/rɪˈseʃn/', definition: 'A period of temporary economic decline', vietnamese: 'suy thoái kinh tế', example: 'The global recession caused unemployment to soar.' },
          { word: 'disparity', phonetic: '/dɪˈspærɪti/', definition: 'A great difference between things', vietnamese: 'sự chênh lệch', example: 'There is significant wealth disparity between urban and rural areas.' },
          { word: 'stakeholder', phonetic: '/ˈsteɪkhəʊldə(r)/', definition: 'A person with an interest in a business or project', vietnamese: 'bên liên quan', example: 'All stakeholders must be consulted before major decisions.' },
          { word: 'infrastructure', phonetic: '/ˈɪnfrəstrʌktʃə(r)/', definition: 'Basic physical systems of a country or organisation', vietnamese: 'cơ sở hạ tầng', example: 'Investment in infrastructure is vital for economic growth.' },
        ],
      },
    },
    {
      id: 'vocab-6',
      section: 'vocabulary', band: 5.0, title: 'Society & Culture', topic: 'Society',
      order: 6, xpReward: 10,
      content: {
        words: [
          { word: 'multicultural', phonetic: '/ˌmʌltiˈkʌltʃərəl/', definition: 'Relating to several different cultures', vietnamese: 'đa văn hóa', example: 'London is one of the most multicultural cities in the world.' },
          { word: 'discrimination', phonetic: '/dɪˌskrɪmɪˈneɪʃn/', definition: 'Unfair treatment based on race, sex, or other factors', vietnamese: 'phân biệt đối xử', example: 'Gender discrimination in the workplace is illegal in many countries.' },
          { word: 'inequality', phonetic: '/ˌɪnɪˈkwɒlɪti/', definition: 'Difference in size, degree, or circumstances', vietnamese: 'bất bình đẳng', example: 'Social inequality can lead to crime and unrest.' },
          { word: 'integration', phonetic: '/ˌɪntɪˈɡreɪʃn/', definition: 'The process of combining with another group', vietnamese: 'hội nhập', example: 'The integration of immigrants into society requires time and support.' },
          { word: 'diversity', phonetic: '/daɪˈvɜːsɪti/', definition: 'A range of many different types of people or things', vietnamese: 'sự đa dạng', example: 'Cultural diversity enriches societies in many ways.' },
          { word: 'urbanisation', phonetic: '/ˌɜːbənaɪˈzeɪʃn/', definition: 'The process by which more people live in cities', vietnamese: 'đô thị hóa', example: 'Rapid urbanisation can strain public services.' },
          { word: 'migration', phonetic: '/maɪˈɡreɪʃn/', definition: 'Movement of people from one place to another', vietnamese: 'di cư', example: 'Economic migration often improves living standards.' },
          { word: 'tradition', phonetic: '/trəˈdɪʃn/', definition: 'A belief or practice passed down over generations', vietnamese: 'truyền thống', example: 'Many young people struggle to balance tradition and modernity.' },
        ],
      },
    },
    {
      id: 'vocab-7',
      section: 'vocabulary', band: 6.5, title: 'Government & Politics', topic: 'Politics',
      order: 7, xpReward: 16,
      content: {
        words: [
          { word: 'democracy', phonetic: '/dɪˈmɒkrəsi/', definition: 'A system of government elected by citizens', vietnamese: 'dân chủ', example: 'Freedom of speech is fundamental to democracy.' },
          { word: 'legislation', phonetic: '/ˌledʒɪˈsleɪʃn/', definition: 'Laws; the process of making laws', vietnamese: 'luật pháp', example: 'New legislation was passed to protect workers\' rights.' },
          { word: 'accountability', phonetic: '/əˌkaʊntəˈbɪlɪti/', definition: 'The obligation to accept responsibility', vietnamese: 'trách nhiệm giải trình', example: 'Public accountability is essential in a democratic government.' },
          { word: 'corruption', phonetic: '/kəˈrʌpʃn/', definition: 'Dishonest behaviour by officials', vietnamese: 'tham nhũng', example: 'Political corruption undermines public trust in institutions.' },
          { word: 'sovereignty', phonetic: '/ˈsɒvrɪnti/', definition: 'Supreme power or authority of a state', vietnamese: 'chủ quyền', example: 'National sovereignty is central to international law.' },
          { word: 'bureaucracy', phonetic: '/bjʊˈrɒkrəsi/', definition: 'A system of government with complex procedures', vietnamese: 'quan liêu', example: 'Excessive bureaucracy slows down economic development.' },
          { word: 'coalition', phonetic: '/ˌkəʊəˈlɪʃn/', definition: 'A temporary alliance for combined action', vietnamese: 'liên minh', example: 'A coalition government was formed after the election.' },
          { word: 'referendum', phonetic: '/ˌrefəˈrendəm/', definition: 'A public vote on a single political question', vietnamese: 'trưng cầu dân ý', example: 'A referendum was held on European Union membership.' },
        ],
      },
    },
    {
      id: 'vocab-8',
      section: 'vocabulary', band: 7.0, title: 'Science & Research', topic: 'Science',
      order: 8, xpReward: 18,
      content: {
        words: [
          { word: 'empirical', phonetic: '/ɪmˈpɪrɪkl/', definition: 'Based on observation or experiment rather than theory', vietnamese: 'thực nghiệm', example: 'The hypothesis requires empirical evidence to be accepted.' },
          { word: 'hypothesis', phonetic: '/haɪˈpɒθɪsɪs/', definition: 'A proposed explanation based on limited evidence', vietnamese: 'giả thuyết', example: 'Scientists must test a hypothesis before drawing conclusions.' },
          { word: 'paradigm', phonetic: '/ˈpærədaɪm/', definition: 'A typical example or framework of understanding', vietnamese: 'mô hình tư duy', example: 'Einstein\'s theory created a paradigm shift in physics.' },
          { word: 'methodology', phonetic: '/ˌmeθəˈdɒlədʒi/', definition: 'A system of methods used in a particular field', vietnamese: 'phương pháp luận', example: 'The research methodology must be clearly explained.' },
          { word: 'correlation', phonetic: '/ˌkɒrəˈleɪʃn/', definition: 'A mutual relationship between two variables', vietnamese: 'tương quan', example: 'There is a strong correlation between education and income.' },
          { word: 'biodiversity', phonetic: '/ˌbaɪəʊdaɪˈvɜːsɪti/', definition: 'The variety of plant and animal life in a habitat', vietnamese: 'đa dạng sinh học', example: 'Climate change is threatening global biodiversity.' },
          { word: 'nanotechnology', phonetic: '/ˌnænəʊtekˈnɒlədʒi/', definition: 'Technology on a molecular or atomic scale', vietnamese: 'công nghệ nano', example: 'Nanotechnology could revolutionise medicine in the future.' },
          { word: 'genome', phonetic: '/ˈdʒiːnəʊm/', definition: 'The complete set of genetic material in an organism', vietnamese: 'hệ gen', example: 'Mapping the human genome was a landmark scientific achievement.' },
        ],
      },
    },
    {
      id: 'vocab-9',
      section: 'vocabulary', band: 5.5, title: 'Media & Communication', topic: 'Media',
      order: 9, xpReward: 12,
      content: {
        words: [
          { word: 'censorship', phonetic: '/ˈsensəʃɪp/', definition: 'The practice of suppressing unacceptable media', vietnamese: 'kiểm duyệt', example: 'Internet censorship limits freedom of information.' },
          { word: 'propaganda', phonetic: '/ˌprɒpəˈɡændə/', definition: 'Information used to promote a political cause', vietnamese: 'tuyên truyền', example: 'Government propaganda influenced public opinion during the war.' },
          { word: 'misinformation', phonetic: '/ˌmɪsɪnfəˈmeɪʃn/', definition: 'False or inaccurate information spread unintentionally', vietnamese: 'thông tin sai lệch', example: 'Misinformation spreads rapidly through social media.' },
          { word: 'broadcast', phonetic: '/ˈbrɔːdkɑːst/', definition: 'To transmit a programme by radio or television', vietnamese: 'phát sóng', example: 'The match was broadcast live to over 200 countries.' },
          { word: 'journalism', phonetic: '/ˈdʒɜːnəlɪzəm/', definition: 'The work of reporting news for media outlets', vietnamese: 'báo chí', example: 'Investigative journalism exposes corruption in public life.' },
          { word: 'platform', phonetic: '/ˈplætfɔːm/', definition: 'A digital service for sharing or distributing content', vietnamese: 'nền tảng', example: 'Social media platforms must regulate harmful content.' },
          { word: 'viral', phonetic: '/ˈvaɪrəl/', definition: 'Quickly spread or popularised via the internet', vietnamese: 'lan truyền nhanh', example: 'The video went viral and received millions of views overnight.' },
          { word: 'credibility', phonetic: '/ˌkredɪˈbɪlɪti/', definition: 'The quality of being trusted and believed', vietnamese: 'uy tín', example: 'Fact-checking is essential to maintain journalistic credibility.' },
        ],
      },
    },
    {
      id: 'vocab-10',
      section: 'vocabulary', band: 6.0, title: 'Transport & Urban Planning', topic: 'Transport',
      order: 10, xpReward: 14,
      content: {
        words: [
          { word: 'congestion', phonetic: '/kənˈdʒestʃən/', definition: 'Excessive crowding; traffic blockage', vietnamese: 'tắc nghẽn', example: 'Traffic congestion is a major problem in most large cities.' },
          { word: 'commute', phonetic: '/kəˈmjuːt/', definition: 'To travel regularly between home and work', vietnamese: 'đi làm hàng ngày', example: 'Long commutes affect workers\' health and wellbeing.' },
          { word: 'pedestrian', phonetic: '/pəˈdestriən/', definition: 'A person walking rather than using a vehicle', vietnamese: 'người đi bộ', example: 'More pedestrian zones should be created in city centres.' },
          { word: 'emission', phonetic: '/ɪˈmɪʃn/', definition: 'Gases or substances released into the atmosphere', vietnamese: 'khí thải', example: 'Electric vehicles produce zero direct emissions.' },
          { word: 'suburb', phonetic: '/ˈsʌbɜːb/', definition: 'A residential area on the edge of a city', vietnamese: 'vùng ngoại ô', example: 'Many people move to suburbs for more affordable housing.' },
          { word: 'zoning', phonetic: '/ˈzəʊnɪŋ/', definition: 'The division of land into areas for specific uses', vietnamese: 'quy hoạch vùng', example: 'Strict zoning laws prevent industrial development near schools.' },
          { word: 'infrastructure', phonetic: '/ˈɪnfrəstrʌktʃə(r)/', definition: 'Basic physical systems of a country or area', vietnamese: 'cơ sở hạ tầng', example: 'Improved transport infrastructure boosts economic development.' },
          { word: 'cycle lane', phonetic: '/ˈsaɪkl leɪn/', definition: 'A part of a road designated for cyclists', vietnamese: 'làn đường xe đạp', example: 'More cycle lanes encourage people to use bicycles.' },
        ],
      },
    },
  ]

  for (const lesson of vocabLessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      create: lesson,
      update: lesson,
    })
  }

  // ─── Grammar Lessons (4 lessons) ─────────────────────────────────
  const grammarLessons = [
    {
      id: 'grammar-1',
      section: 'grammar', band: 5.5, title: 'Conditional Sentences', topic: 'Conditionals',
      order: 1, xpReward: 15,
      content: {
        rule: 'Conditional Sentences',
        explanation: 'Conditional sentences express situations and their consequences. There are 4 main types used in IELTS writing and speaking.',
        examples: [
          'Type 1 (Real): If it rains, I will stay home.',
          'Type 2 (Unreal present): If I were rich, I would travel the world.',
          'Type 3 (Unreal past): If she had studied harder, she would have passed.',
          'Mixed: If I had saved money, I would be able to afford it now.',
        ],
        exercises: [
          { question: 'If I _____ (have) more time, I would learn a new language.', options: ['had', 'have', 'will have', 'having'], correct: 0, explanation: 'Type 2 conditional uses "had" in the if-clause.' },
          { question: 'If the government _____ (invest) in education, the economy would improve.', options: ['invest', 'invests', 'invested', 'will invest'], correct: 2, explanation: 'Type 2: if + past simple.' },
          { question: 'If she _____ (study) medicine, she would have become a doctor.', options: ['studies', 'studied', 'had studied', 'has studied'], correct: 2, explanation: 'Type 3: if + past perfect.' },
          { question: 'Unless we _____ (reduce) carbon emissions, temperatures will rise.', options: ['reduce', 'reduced', 'will reduce', 'are reducing'], correct: 0, explanation: '"Unless" = "if not" + present simple for Type 1.' },
          { question: 'Were the government to _____ (act) now, the crisis could be averted.', options: ['acted', 'act', 'acting', 'acts'], correct: 1, explanation: 'Formal inversion: "Were + subject + to + infinitive".' },
        ],
      },
    },
    {
      id: 'grammar-2',
      section: 'grammar', band: 6.0, title: 'Passive Voice', topic: 'Passive Voice',
      order: 2, xpReward: 15,
      content: {
        rule: 'Passive Voice',
        explanation: 'The passive voice is used extensively in academic IELTS writing. It shifts focus from the doer to the action or receiver.',
        examples: [
          'Active: Scientists have discovered a new species.',
          'Passive: A new species has been discovered (by scientists).',
          'Active: The government is implementing new policies.',
          'Passive: New policies are being implemented by the government.',
        ],
        exercises: [
          { question: 'The report _____ (publish) by the UN last year.', options: ['was published', 'published', 'has published', 'is publishing'], correct: 0, explanation: 'Past simple passive: was/were + past participle.' },
          { question: 'New measures _____ (introduce) to combat pollution.', options: ['are being introduced', 'are introducing', 'have introduced', 'introducing'], correct: 0, explanation: 'Present continuous passive: am/is/are + being + past participle.' },
          { question: 'It is generally _____ (believe) that education reduces poverty.', options: ['believe', 'believed', 'believing', 'believes'], correct: 1, explanation: 'Impersonal passive: "It is believed that..."' },
          { question: 'The project _____ (complete) by next month.', options: ['will complete', 'will be completed', 'has been completed', 'is completed'], correct: 1, explanation: 'Future passive: will + be + past participle.' },
          { question: 'The data _____ (collect) using surveys and interviews.', options: ['collected', 'was collected', 'has collected', 'collecting'], correct: 1, explanation: 'Past simple passive for research writing.' },
        ],
      },
    },
    {
      id: 'grammar-3',
      section: 'grammar', band: 5.0, title: 'Articles: A, An, The', topic: 'Articles',
      order: 3, xpReward: 12,
      content: {
        rule: 'Articles: A, An, The',
        explanation: 'Articles are one of the most common errors in IELTS writing. "The" is used for specific nouns; "a/an" for general single nouns; no article for general plurals.',
        examples: [
          'The government should invest in education. (specific)',
          'A university education provides many benefits. (general singular)',
          'Children need access to quality schools. (general plural – no article)',
          'The study conducted by WHO revealed... (specific study)',
        ],
        exercises: [
          { question: '_____ unemployment is a serious issue in many countries.', options: ['A', 'An', 'The', 'No article'], correct: 3, explanation: 'General concept = no article.' },
          { question: 'The government published _____ report on climate change.', options: ['a', 'an', 'the', 'no article'], correct: 0, explanation: 'First mention of a singular countable noun = "a".' },
          { question: '_____ internet has transformed modern communication.', options: ['A', 'An', 'The', 'No article'], correct: 2, explanation: '"The" for unique or previously mentioned things.' },
          { question: 'She is studying to become _____ engineer.', options: ['a', 'an', 'the', 'no article'], correct: 1, explanation: '"An" before vowel sounds.' },
          { question: 'Many researchers have studied _____ effects of social media.', options: ['a', 'an', 'the', 'no article'], correct: 2, explanation: '"The" when referring to specific known effects.' },
        ],
      },
    },
    {
      id: 'grammar-4',
      section: 'grammar', band: 6.5, title: 'Relative Clauses', topic: 'Relative Clauses',
      order: 4, xpReward: 18,
      content: {
        rule: 'Relative Clauses',
        explanation: 'Relative clauses add information about nouns using who, which, that, whose, where. They can be defining (no commas) or non-defining (with commas).',
        examples: [
          'Defining: Students who study regularly tend to achieve higher grades.',
          'Non-defining: The government, which introduced the policy in 2020, has reversed its decision.',
          'Whose: Countries whose economies depend on tourism were severely affected.',
          'Where: The region where the disaster occurred needs international support.',
        ],
        exercises: [
          { question: 'Technology _____ connects people across the world has transformed society.', options: ['who', 'which', 'whose', 'where'], correct: 1, explanation: '"Which" for things/ideas.' },
          { question: 'The scientist, _____ research won the Nobel Prize, was celebrated worldwide.', options: ['who', 'which', 'whose', 'where'], correct: 2, explanation: '"Whose" shows possession.' },
          { question: 'The city _____ the conference was held became a cultural hub.', options: ['which', 'who', 'where', 'whose'], correct: 2, explanation: '"Where" for places.' },
          { question: 'People _____ live in urban areas face different challenges than rural residents.', options: ['which', 'who', 'whose', 'where'], correct: 1, explanation: '"Who" for people.' },
          { question: 'The report, _____ was published last year, highlighted key issues.', options: ['that', 'which', 'who', 'whose'], correct: 1, explanation: 'Non-defining relative clause uses "which" (not "that").' },
        ],
      },
    },
  ]

  for (const lesson of grammarLessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      create: lesson,
      update: lesson,
    })
  }

  // ─── Reading Tests (5 tests) ──────────────────────────────────────
  const readingTests = [
    {
      id: 'reading-1',
      title: 'The Impact of Climate Change on Coastal Cities',
      band: 5.5,
      topic: 'Environment',
      timeLimit: 60,
      passage: `Climate change poses an unprecedented threat to coastal cities worldwide. Rising sea levels, driven by the thermal expansion of oceans and the melting of polar ice caps, are projected to inundate low-lying urban areas by the end of this century. Cities such as Miami, Bangkok, and Jakarta face the prospect of frequent flooding that could render large portions uninhabitable.

The economic consequences of this phenomenon are staggering. Infrastructure damage, property losses, and the costs of adaptation measures are expected to reach trillions of dollars globally. Insurance companies are already withdrawing coverage from high-risk areas, while property values in vulnerable zones have begun to decline. This creates a paradox where the populations most affected are often those least able to afford relocation.

Government responses have varied considerably. The Netherlands, with its extensive experience in water management, has developed sophisticated flood defenses including storm surge barriers and elevated housing. Singapore has incorporated sea-level rise projections into its long-term urban planning. In contrast, many developing nations lack both the financial resources and the technical expertise to implement comparable measures.

The social dimensions of climate displacement are equally complex. Communities with deep historical and cultural ties to coastal areas face not merely physical relocation but the dissolution of social networks and cultural identity. Indigenous coastal communities are particularly vulnerable, as their traditional practices and livelihoods are intimately connected to the marine environment.

Innovative solutions are emerging from various quarters. Floating cities and amphibious architecture offer radical reimaginings of urban form. Green infrastructure, including restored mangroves and constructed wetlands, provides natural buffers against storm surges. Urban greening initiatives reduce the heat island effect and improve drainage. However, experts caution that no single solution is sufficient; a portfolio of adaptive strategies tailored to local conditions is essential.

The window for effective action is narrowing. Scientists warn that if greenhouse gas emissions are not dramatically reduced within the next decade, the scale of adaptation required will become economically and technically infeasible for many regions. The choices made now by governments, businesses, and individuals will determine whether coastal cities can survive as viable human settlements or become monuments to shortsighted development.`,
      questions: [
        { id: 1, type: 'mcq', question: 'What are the two main causes of rising sea levels mentioned in the passage?', answer: 'Thermal expansion and melting ice caps', options: ['Storms and tsunamis', 'Thermal expansion and melting ice caps', 'Deforestation and urbanization', 'Volcanic activity and erosion'] },
        { id: 2, type: 'tfng', question: 'Insurance companies are reducing coverage in high-risk coastal areas.', answer: 'True' },
        { id: 3, type: 'tfng', question: 'The Netherlands has the most advanced flood defense system in the world.', answer: 'Not Given' },
        { id: 4, type: 'mcq', question: 'What makes indigenous coastal communities especially vulnerable?', answer: 'Their traditional practices tied to the marine environment', options: ['Their lack of political influence', 'Their financial poverty', 'Their traditional practices tied to the marine environment', 'Their geographical isolation'] },
        { id: 5, type: 'tfng', question: 'Floating cities are already being used as permanent residences in some countries.', answer: 'Not Given' },
        { id: 6, type: 'tfng', question: 'A single solution is sufficient to address coastal flooding challenges.', answer: 'False' },
        { id: 7, type: 'mcq', question: 'According to the passage, what is a "portfolio of adaptive strategies"?', answer: 'Multiple different solutions combined together', options: ['A financial investment portfolio', 'Multiple different solutions combined together', 'A government document on climate policy', 'An insurance product for coastal areas'] },
        { id: 8, type: 'tfng', question: 'Singapore has incorporated sea-level rise into its long-term planning.', answer: 'True' },
        { id: 9, type: 'short', question: 'Name two innovative architectural solutions mentioned for coastal flooding.', answer: 'Floating cities and amphibious architecture' },
        { id: 10, type: 'short', question: 'What natural infrastructure provides buffers against storm surges?', answer: 'Restored mangroves and constructed wetlands' },
      ],
    },
    {
      id: 'reading-2',
      title: 'The History and Future of Artificial Intelligence',
      band: 6.5,
      topic: 'Technology',
      timeLimit: 60,
      passage: `Artificial intelligence (AI) has become one of the most transformative technologies of the twenty-first century, yet its foundations date back decades. The term "artificial intelligence" was first coined by John McCarthy in 1956 at the Dartmouth Conference, where researchers gathered with the optimistic goal of creating machines that could simulate human intelligence. Early AI research focused on symbolic reasoning and rule-based systems, achieving notable early successes such as programs that could play chess or solve mathematical problems.

However, progress proved slower than anticipated. The field experienced two significant "AI winters" – periods of reduced funding and interest – in the 1970s and 1980s, when the limitations of early approaches became apparent. Machine learning, which allows systems to learn from data rather than following explicit rules, began to gain traction in the 1990s. The availability of larger datasets and more powerful computing hardware gradually enabled more sophisticated applications.

The modern era of AI is characterised primarily by deep learning, a subset of machine learning that uses artificial neural networks with many layers. This approach, inspired by the structure of the human brain, has achieved remarkable results in image recognition, natural language processing, and game playing. In 2012, a deep learning system trained on millions of images dramatically outperformed previous approaches in image classification. Since then, the capabilities of AI systems have continued to expand at a rapid pace.

Current AI applications span numerous sectors. In healthcare, AI algorithms can analyse medical images to detect diseases such as cancer with accuracy comparable to experienced physicians. In finance, AI is used for fraud detection, algorithmic trading, and risk assessment. In transportation, self-driving vehicle technology is being developed by numerous companies, though widespread deployment remains several years away. Natural language processing has produced sophisticated chatbots and translation services that are transforming how people interact with technology.

Despite these advances, current AI systems remain narrow in their capabilities – they can excel at specific tasks but lack the general reasoning ability of human intelligence. Artificial General Intelligence (AGI) – a hypothetical AI that can perform any intellectual task a human can – remains a long-term research goal with no clear timeline. Some researchers believe AGI could be achieved within decades, while others argue it may never be possible.

The societal implications of increasingly capable AI are subjects of intense debate. Economic concerns centre on automation displacing human workers across many industries. Ethical questions involve algorithmic bias, privacy in surveillance applications, and the use of AI in military systems. Governance challenges include how to regulate AI development to ensure it benefits humanity broadly rather than concentrating power in the hands of a few technology companies or governments.`,
      questions: [
        { id: 1, type: 'short', question: 'Who coined the term "artificial intelligence" and in what year?', answer: 'John McCarthy in 1956' },
        { id: 2, type: 'tfng', question: 'Early AI research met all its initial goals by the 1970s.', answer: 'False' },
        { id: 3, type: 'mcq', question: 'What characterises machine learning compared to earlier AI approaches?', answer: 'It allows systems to learn from data rather than following explicit rules', options: ['It allows systems to learn from data rather than following explicit rules', 'It uses explicit rules programmed by humans', 'It requires less computing power', 'It was the first approach used in AI research'] },
        { id: 4, type: 'tfng', question: 'Deep learning is inspired by the structure of the human brain.', answer: 'True' },
        { id: 5, type: 'mcq', question: 'In which year did a deep learning system achieve a breakthrough in image classification?', answer: '2012', options: ['2012', '2005', '1990', '2018'] },
        { id: 6, type: 'tfng', question: 'Self-driving vehicles are already widely deployed on public roads.', answer: 'False' },
        { id: 7, type: 'mcq', question: 'What is Artificial General Intelligence (AGI)?', answer: 'A hypothetical AI that can perform any intellectual task a human can', options: ['A hypothetical AI that can perform any intellectual task a human can', 'A current AI used in medical diagnosis', 'An AI generally available to the public', 'The current standard of AI technology'] },
        { id: 8, type: 'tfng', question: 'All AI researchers agree that AGI will be achieved within decades.', answer: 'False' },
        { id: 9, type: 'short', question: 'What term describes periods of reduced funding and interest in AI research?', answer: 'AI winters' },
        { id: 10, type: 'tfng', question: 'Current AI systems can perform any intellectual task as well as humans.', answer: 'False' },
      ],
    },
    {
      id: 'reading-3',
      title: 'Global Water Scarcity: Challenges and Solutions',
      band: 7.0,
      topic: 'Environment',
      timeLimit: 60,
      passage: `Water scarcity is one of the defining challenges of the twenty-first century. Despite covering approximately 70% of the Earth's surface, only about 2.5% of the world's water is fresh, and less than 1% is readily accessible for human use. Population growth, agricultural demands, pollution, and the effects of climate change are placing unprecedented pressure on this finite resource. The United Nations estimates that by 2050, over half the world's population could face severe water shortages.

The causes of water scarcity are multifaceted and vary considerably by region. Physical water scarcity occurs when there is genuinely insufficient water to meet demand, as experienced in arid regions of the Middle East, North Africa, and Sub-Saharan Africa. Economic water scarcity, by contrast, occurs when water exists but infrastructure and institutions for accessing it are inadequate – a problem that affects many developing countries despite adequate rainfall. Groundwater depletion is a particularly concerning trend globally; aquifers that took thousands of years to fill are being extracted at rates far exceeding natural recharge, with major aquifer systems in India, the United States, and China showing alarming declines.

Agriculture accounts for approximately 70% of global freshwater withdrawals, making improvements in agricultural water management essential to addressing the broader challenge. Traditional flood irrigation methods can be highly inefficient, with significant water lost to evaporation and runoff. Precision irrigation technologies, including drip irrigation systems that deliver water directly to plant roots, can reduce agricultural water use by 30-50% while maintaining or improving crop yields.

Technological innovation is offering new solutions to water scarcity. Desalination – the removal of salt from seawater – has expanded significantly, with countries like Saudi Arabia and Israel relying heavily on it for freshwater supplies. While historically energy-intensive and expensive, advances in reverse osmosis technology have reduced costs substantially. Atmospheric water generation, which extracts moisture from air, is emerging as a potential solution for remote areas.

Effective water governance is perhaps as important as technological solutions. Many water conflicts occur at borders between nations sharing river systems or aquifers. International water treaties have had mixed success in managing shared resources. At the national level, appropriate pricing of water is a contentious issue: prices too low fail to encourage conservation, while prices too high can prevent access for the poor.

The intersection of water scarcity and climate change presents particular concern for the future. Rising temperatures are shifting precipitation patterns, increasing evaporation rates, and accelerating glacial melting. Glaciers serve as critical freshwater reservoirs for hundreds of millions of people in Asia and South America, and their rapid retreat threatens long-term water security for these regions.`,
      questions: [
        { id: 1, type: 'mcq', question: 'What percentage of the Earth\'s water is readily accessible for human use?', answer: 'Less than 1%', options: ['Less than 1%', '2.5%', '70%', '10%'] },
        { id: 2, type: 'tfng', question: 'Physical water scarcity only occurs in developing countries.', answer: 'False' },
        { id: 3, type: 'mcq', question: 'What is economic water scarcity?', answer: 'When water exists but infrastructure to access it is lacking', options: ['When water exists but infrastructure to access it is lacking', 'When countries cannot afford to import water', 'When water prices are too high for consumers', 'When economic growth depletes water supplies'] },
        { id: 4, type: 'tfng', question: 'Aquifer depletion is occurring faster than natural recharge in some regions.', answer: 'True' },
        { id: 5, type: 'short', question: 'What percentage of global freshwater withdrawals does agriculture account for?', answer: '70%' },
        { id: 6, type: 'mcq', question: 'By how much can precision irrigation reduce agricultural water use?', answer: '30-50%', options: ['30-50%', '10-20%', '60-70%', '80-90%'] },
        { id: 7, type: 'tfng', question: 'Desalination technology costs have remained consistently high.', answer: 'False' },
        { id: 8, type: 'mcq', question: 'What is the challenge with water pricing?', answer: 'Low prices discourage conservation while high prices prevent access for the poor', options: ['Low prices discourage conservation while high prices prevent access for the poor', 'All water must be provided free of charge', 'Water pricing has no effect on consumption', 'High prices always lead to better outcomes'] },
        { id: 9, type: 'tfng', question: 'Glaciers are an important freshwater source for people in Asia and South America.', answer: 'True' },
        { id: 10, type: 'short', question: 'What technology removes salt from seawater to produce freshwater?', answer: 'Desalination' },
      ],
    },
    {
      id: 'reading-4',
      title: 'The Psychology of Motivation and Achievement',
      band: 6.0,
      topic: 'Psychology',
      timeLimit: 60,
      passage: `What drives people to achieve? This question has fascinated psychologists for over a century, and the answers they have found have profound implications for education, business, and personal development. Theories of motivation have evolved considerably, moving from simple reward-and-punishment models to nuanced frameworks that account for internal psychological needs and social contexts.

Early behavioural theories, most notably associated with B.F. Skinner, viewed motivation primarily in terms of external reinforcement. According to this view, behaviour is shaped by consequences: actions that are rewarded tend to be repeated, while those that are punished are suppressed. While this model has clear applications in certain contexts, it fails to explain why people often engage enthusiastically in activities that offer no tangible reward, or why external rewards can sometimes undermine intrinsic motivation.

Abraham Maslow's hierarchy of needs, proposed in 1943, offered a more comprehensive framework. Maslow argued that human motivation operates in a hierarchical fashion, with physiological needs such as food and shelter forming the base, followed by safety, social belonging, esteem, and finally self-actualisation – the desire to fulfil one's full potential. While the strict hierarchical structure has been questioned by later researchers, the framework remains influential for recognising that people are motivated by a range of needs, not just immediate survival.

Edward Deci and Richard Ryan's Self-Determination Theory (SDT), developed from the 1970s onwards, has become one of the most empirically supported theories in motivational psychology. SDT identifies three fundamental psychological needs: autonomy (the need to feel in control of one's actions), competence (the need to feel effective), and relatedness (the need for meaningful connections with others). When these needs are met, people experience intrinsic motivation – engaging in activities for their inherent satisfaction rather than external rewards. Critically, SDT research has shown that offering external rewards for inherently enjoyable activities can reduce intrinsic motivation, a phenomenon known as the "over-justification effect."

Research on achievement goals has further refined our understanding. Carol Dweck's work on "mindset" has been particularly influential. Her research distinguishes between a "fixed mindset" – the belief that abilities are innate and unchangeable – and a "growth mindset" – the belief that abilities can be developed through effort. Students with a growth mindset tend to embrace challenges, persist through difficulties, and view failures as learning opportunities, leading to higher long-term achievement.

Practical applications of motivational research are widespread. In education, teachers who support student autonomy and provide constructive rather than controlling feedback tend to foster higher intrinsic motivation and better learning outcomes. In the workplace, organisations that empower employees with meaningful work and clear development pathways report higher engagement and productivity.`,
      questions: [
        { id: 1, type: 'mcq', question: 'What was the primary focus of early behavioural theories of motivation?', answer: 'External reinforcement through rewards and punishment', options: ['External reinforcement through rewards and punishment', 'Internal psychological needs', 'Social and cultural factors', 'Biological drives'] },
        { id: 2, type: 'tfng', question: 'External rewards always increase motivation according to behavioural theory.', answer: 'False' },
        { id: 3, type: 'mcq', question: 'In Maslow\'s hierarchy, what does self-actualisation refer to?', answer: 'The desire to fulfil one\'s full potential', options: ['The desire to fulfil one\'s full potential', 'The need for food and shelter', 'Social belonging and connection', 'The desire for esteem from others'] },
        { id: 4, type: 'tfng', question: 'Maslow\'s strict hierarchical structure is universally accepted by modern researchers.', answer: 'False' },
        { id: 5, type: 'short', question: 'What are the three fundamental psychological needs identified by Self-Determination Theory?', answer: 'Autonomy, competence, and relatedness' },
        { id: 6, type: 'mcq', question: 'What is the "over-justification effect"?', answer: 'When external rewards reduce intrinsic motivation for an enjoyable activity', options: ['When external rewards reduce intrinsic motivation for an enjoyable activity', 'When too many rules prevent people from working effectively', 'When people set unrealistically high goals', 'When rewards are not large enough to motivate people'] },
        { id: 7, type: 'tfng', question: 'Students with a growth mindset tend to avoid challenges to protect their self-esteem.', answer: 'False' },
        { id: 8, type: 'mcq', question: 'What distinguishes a "fixed mindset" from a "growth mindset"?', answer: 'Fixed mindset sees abilities as innate; growth mindset sees abilities as developable', options: ['Fixed mindset sees abilities as innate; growth mindset sees abilities as developable', 'Fixed mindset involves clear goals; growth mindset involves flexible goals', 'They are essentially the same concept', 'Growth mindset focuses on external rewards'] },
        { id: 9, type: 'tfng', question: 'Dweck\'s mindset research has been applied in educational settings.', answer: 'True' },
        { id: 10, type: 'short', question: 'What type of feedback do autonomy-supporting teachers provide?', answer: 'Constructive (rather than controlling) feedback' },
      ],
    },
    {
      id: 'reading-5',
      title: 'Urbanisation and the Future of Cities',
      band: 8.0,
      topic: 'Society',
      timeLimit: 60,
      passage: `The twenty-first century is an urban century. For the first time in human history, more than half the world's population resides in cities – a threshold crossed in 2007 – and this proportion is projected to reach 68% by 2050. This unprecedented urbanisation is reshaping economies, social structures, and the environment in profound and complex ways. How cities manage this growth will be one of the defining challenges and opportunities of our era.

Urbanisation has historically been associated with economic development and improved living standards. Cities generate disproportionate shares of national GDP: cities with just 20% of a country's population often generate 50-60% of its economic output. The agglomeration of people, capital, and knowledge in cities creates efficiencies and synergies – what economists call "agglomeration effects" – that facilitate innovation and productivity growth. Urban dwellers typically have better access to education, healthcare, and economic opportunities than their rural counterparts.

Yet the relationship between urbanisation and development is not uniformly positive. In many developing countries, rapid urbanisation has outpaced the ability of governments to provide adequate housing, infrastructure, and services. Informal settlements – commonly called slums – are home to approximately one billion people globally, characterised by inadequate housing, poor sanitation, and vulnerability to flooding and other hazards. These settlements often emerge at city peripheries where land is cheaper but access to services and employment is more difficult.

The environmental footprint of cities is enormous. Urban areas consume approximately 75% of the world's energy and produce 70-80% of global greenhouse gas emissions. Traffic congestion imposes economic costs and health burdens through air pollution. Urban heat island effects – where cities are significantly warmer than surrounding rural areas – are intensifying with climate change. At the same time, cities' density makes them fundamentally more efficient than dispersed settlement patterns: dense cities can support high-quality public transportation and reduce per-capita infrastructure costs.

The concept of the "smart city" has gained considerable traction as a vision for urban futures. Smart city initiatives leverage digital technologies – sensors, data analytics, artificial intelligence, connected devices – to optimise urban systems from traffic flow to energy grids. Singapore, Barcelona, and Copenhagen are frequently cited as leading examples. However, critics raise legitimate concerns about surveillance, data privacy, and the risk of creating technocratic governance that bypasses meaningful democratic participation.

Urban planning philosophy has also been evolving. Transit-oriented development – designing dense, mixed-use neighbourhoods around public transportation nodes – is being implemented in cities worldwide as a strategy for sustainable growth. Many cities are also rediscovering the value of green infrastructure: parks, urban forests, and green roofs that provide ecological services, manage stormwater, reduce urban heat, and improve mental health.`,
      questions: [
        { id: 1, type: 'short', question: 'In what year did more than half the world\'s population first live in cities?', answer: '2007' },
        { id: 2, type: 'mcq', question: 'What are "agglomeration effects"?', answer: 'Economic efficiencies created by concentrating people, capital, and knowledge in cities', options: ['Economic efficiencies created by concentrating people, capital, and knowledge in cities', 'The negative effects of overcrowding', 'The process of rural people moving to cities', 'Environmental damage caused by urban expansion'] },
        { id: 3, type: 'tfng', question: 'Informal settlements are typically located in city centres.', answer: 'False' },
        { id: 4, type: 'mcq', question: 'Approximately what percentage of global greenhouse gas emissions come from urban areas?', answer: '70-80%', options: ['70-80%', '30-40%', '50-60%', '90-100%'] },
        { id: 5, type: 'tfng', question: 'Dense cities are fundamentally less efficient than dispersed settlement patterns.', answer: 'False' },
        { id: 6, type: 'mcq', question: 'What is a "smart city"?', answer: 'A city that uses digital technologies to optimise urban systems and services', options: ['A city that uses digital technologies to optimise urban systems and services', 'A city with a highly educated population', 'A city with no informal settlements', 'A city that has eliminated traffic congestion'] },
        { id: 7, type: 'tfng', question: 'Critics have no valid concerns about smart city initiatives.', answer: 'False' },
        { id: 8, type: 'mcq', question: 'What does "transit-oriented development" involve?', answer: 'Building dense, mixed-use neighbourhoods around public transportation nodes', options: ['Building dense, mixed-use neighbourhoods around public transportation nodes', 'Developing transportation in rural areas', 'Prioritising private car infrastructure', 'Building new cities from scratch'] },
        { id: 9, type: 'tfng', question: 'Green infrastructure can help manage stormwater and reduce urban heat.', answer: 'True' },
        { id: 10, type: 'short', question: 'Name three examples of green infrastructure mentioned in the passage.', answer: 'Parks, urban forests, and green roofs' },
      ],
    },
  ]

  for (const test of readingTests) {
    await prisma.readingTest.upsert({
      where: { id: test.id },
      create: { ...test, questions: test.questions as any },
      update: { ...test, questions: test.questions as any },
    })
  }

  // ─── Speaking Questions (5 questions) ────────────────────────────
  const speakingQuestions = [
    { id: 'speaking-1', part: 1, band: 5.0, question: 'Do you enjoy studying? Why or why not?', topic: 'Education', tips: 'Give reasons and examples. Aim for 2-3 sentences. Use present simple and personal experiences.' },
    { id: 'speaking-2', part: 1, band: 5.0, question: 'What type of transport do you usually use to get to work or school?', topic: 'Transport', tips: 'Describe your daily commute. Mention why you prefer this type. Add comparisons if possible.' },
    { id: 'speaking-3', part: 2, band: 6.0, question: 'Describe a time when you helped someone. You should say: who you helped, why they needed help, how you helped them, and explain how you felt about helping them.', topic: 'Personal Experience', tips: 'Use past simple and past continuous. Describe emotions clearly. Structure: who → situation → action → feeling.' },
    { id: 'speaking-4', part: 2, band: 6.5, question: 'Describe an important decision you made. You should say: what the decision was, when you made it, how you made it, and explain why it was important.', topic: 'Personal Experience', tips: 'Use narrative language: "I was faced with...", "After careful consideration...". Show reflection and evaluation.' },
    { id: 'speaking-5', part: 3, band: 7.0, question: 'Do you think technology has made communication between people better or worse? Give reasons for your answer.', topic: 'Technology', tips: 'Present a balanced argument. Use discourse markers: "On one hand...", "Nevertheless...". Give specific examples.' },
  ]

  for (const q of speakingQuestions) {
    await prisma.speakingQuestion.upsert({
      where: { id: q.id },
      create: q,
      update: q,
    })
  }

  // ─── Writing Prompts (4 prompts) ──────────────────────────────────
  const writingPrompts = [
    {
      id: 'writing-1',
      taskType: 'task1', band: 6.0, topic: 'Graph Description',
      prompt: 'The graph below shows the percentage of households in a European country that had access to the internet between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      sampleBand6: 'The line graph shows information about internet access in households in a European country from 2000 to 2020.\n\nOverall, there was a significant increase in internet access over the 20-year period, rising from less than 20% to nearly 95% of households.\n\nIn 2000, only around 18% of households had internet access. This figure grew steadily over the following decade, reaching approximately 60% by 2010. Growth was particularly rapid between 2000 and 2005.\n\nFrom 2010 onwards, the rate of increase slowed somewhat, though access continued to grow. By 2015, around 80% of households were online, and by 2020, this had risen to approximately 94%.',
    },
    {
      id: 'writing-2',
      taskType: 'task1', band: 7.0, topic: 'Process Diagram',
      prompt: 'The diagram below shows how solar panels generate electricity for domestic use. Summarise the information by selecting and reporting the main features. Write at least 150 words.',
      sampleBand6: 'The diagram illustrates the process by which solar panels produce electricity that can be used in homes.\n\nThe process begins when sunlight hits the solar panels on the roof. The panels contain photovoltaic cells that convert solar energy into direct current (DC) electricity.\n\nNext, the DC electricity passes through an inverter, which converts it into alternating current (AC) electricity required by household appliances.\n\nThe AC electricity can then be used directly to power the home. Any excess electricity can be stored in a battery system for use at night, or fed back into the national electricity grid.\n\nOverall, the process involves several transformation stages to produce usable household electricity from sunlight.',
    },
    {
      id: 'writing-3',
      taskType: 'task2', band: 6.5, topic: 'Environment',
      prompt: 'Some people think that the government should impose higher taxes on activities that damage the environment, while others believe that individuals should take responsibility for making environmentally friendly choices. Discuss both views and give your own opinion. Write at least 250 words.',
      sampleBand6: 'Protecting the environment is one of the most pressing challenges of our time. Some people believe that governments should use taxation to discourage harmful activities, while others feel that individuals should voluntarily make greener choices.\n\nThose who support higher environmental taxes argue that financial incentives are one of the most effective tools for changing behaviour. When activities such as driving petrol cars become more expensive, consumers and businesses are motivated to seek alternatives. Countries such as Sweden have successfully reduced carbon emissions through carbon taxation.\n\nOn the other hand, critics argue that taxes tend to affect poorer people disproportionately, since they spend a higher proportion of their income on energy and fuel. Furthermore, individuals should be free to make their own choices.\n\nIn my view, both approaches are necessary and complementary. Government regulation and taxation can drive systemic change that individual action alone cannot achieve, but individuals must also take personal responsibility.\n\nIn conclusion, addressing environmental damage requires coordinated action from both governments and individuals.',
    },
    {
      id: 'writing-4',
      taskType: 'task2', band: 7.5, topic: 'Technology',
      prompt: 'Artificial intelligence will soon replace most human workers, leaving many people unemployed and without purpose. To what extent do you agree or disagree with this statement? Write at least 250 words.',
      sampleBand6: 'Artificial intelligence (AI) is developing rapidly and is already being used in many industries. Some people believe that it will eventually replace most human workers, causing widespread unemployment. While I agree that AI will significantly change the workforce, I disagree that it will make most workers unemployed.\n\nAI is undoubtedly capable of automating many routine and repetitive tasks. In manufacturing, robotic systems now perform tasks previously done by humans. In finance, algorithms can analyse vast amounts of data far faster than humans.\n\nHowever, AI is unlikely to replace all human work. Many jobs require creativity, empathy, complex social interaction, and moral judgement that current AI systems cannot replicate. Teachers, nurses, social workers, and artists perform work that is fundamentally human in nature.\n\nFurthermore, even if AI changes the nature of work significantly, this does not mean people will be without purpose. People find meaning not only in paid employment but in family, community, creativity, and learning.\n\nIn conclusion, while AI will undoubtedly transform the labour market, I believe the prediction that most people will be unemployed and without purpose is exaggerated.',
    },
  ]

  for (const p of writingPrompts) {
    await prisma.writingPrompt.upsert({
      where: { id: p.id },
      create: p,
      update: p,
    })
  }

  console.log('Seed completed successfully!')
  console.log(`  Vocabulary lessons: ${vocabLessons.length}`)
  console.log(`  Grammar lessons: ${grammarLessons.length}`)
  console.log(`  Reading tests: ${readingTests.length}`)
  console.log(`  Speaking questions: ${speakingQuestions.length}`)
  console.log(`  Writing prompts: ${writingPrompts.length}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => prisma.$disconnect())
