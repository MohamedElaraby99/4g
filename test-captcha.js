// Test script for CAPTCHA functionality
import axios from 'axios';

const BASE_URL = 'http://localhost:4015/api/v1';

async function testCaptcha() {
  try {
    console.log('🧪 Testing CAPTCHA functionality...');
    
    // Test 1: Generate CAPTCHA
    console.log('\n1. Generating CAPTCHA...');
    const generateResponse = await axios.get(`${BASE_URL}/captcha/generate`);
    console.log('✅ CAPTCHA generated successfully');
    console.log('Response:', generateResponse.data);
    
    const { sessionId, question } = generateResponse.data.data;
    
    // Test 2: Verify CAPTCHA with wrong answer
    console.log('\n2. Testing wrong answer...');
    try {
      await axios.post(`${BASE_URL}/captcha/verify`, {
        sessionId,
        answer: '999'
      });
    } catch (error) {
      console.log('✅ Wrong answer correctly rejected');
      console.log('Error:', error.response?.data?.message);
    }
    
    // Test 3: Verify CAPTCHA with correct answer
    console.log('\n3. Testing correct answer...');
    // Extract the answer from the question (this is a simple test)
    const questionText = question;
    const match = questionText.match(/ما هو ناتج: (\d+) ([+\-×]) (\d+)/);
    
    if (match) {
      const num1 = parseInt(match[1]);
      const operator = match[2];
      const num2 = parseInt(match[3]);
      
      let correctAnswer;
      switch (operator) {
        case '+':
          correctAnswer = num1 + num2;
          break;
        case '-':
          correctAnswer = num1 - num2;
          break;
        case '×':
          correctAnswer = num1 * num2;
          break;
        default:
          correctAnswer = 0;
      }
      
      console.log(`Question: ${num1} ${operator} ${num2} = ${correctAnswer}`);
      
      const verifyResponse = await axios.post(`${BASE_URL}/captcha/verify`, {
        sessionId,
        answer: correctAnswer.toString()
      });
      
      console.log('✅ Correct answer accepted');
      console.log('Response:', verifyResponse.data);
    } else {
      console.log('❌ Could not parse question:', questionText);
    }
    
    console.log('\n🎉 All CAPTCHA tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testCaptcha();
