import { useState } from 'react';
import { Plus, Trash2, Clock, Send } from 'lucide-react';

const CreatePoll = ({ sessionId, onPollCreated }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.trim());
    if (!question.trim() || validOptions.length < 2) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/api/polls/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          question: question.trim(),
          options: validOptions,
          duration,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onPollCreated(data.poll);
        
        // Reset form
        setQuestion('');
        setOptions(['', '']);
        setDuration(60);
      }
    } catch (error) {
      console.error('Error creating poll:', error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Poll Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input-field min-h-[100px] resize-none"
          placeholder="Enter your poll question..."
          required
        />
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer Options
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {String.fromCharCode(65 + index)}
              </span>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 input-field"
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </button>
        )}
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="inline h-4 w-4 mr-1" />
          Duration (seconds)
        </label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="input-field"
        >
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={120}>2 minutes</option>
          <option value={300}>5 minutes</option>
          <option value={600}>10 minutes</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !question.trim() || options.filter(opt => opt.trim()).length < 2}
        className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Poll...
          </div>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Create Poll
          </>
        )}
      </button>
    </form>
  );
};

export default CreatePoll;