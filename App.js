// Import necessary React Native components and Axios
import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';

// Component for adding a new task
const AddNewTask = ({ onAddTask }) => {
  const [task, setTask] = useState('');

  
  const handleAddTask = () => {
    onAddTask(task);
    setTask('');
  };

  return (
    <View style={styles.addTaskContainer}>
      <TextInput
        style={styles.taskInput}
        placeholder="Add new task..."
        value={task}
        onChangeText={setTask}
      />
      <Button title="Add" onPress={handleAddTask} />
    </View>
  );
};

// Component for displaying all current tasks
const TaskList = ({ tasks, onRefresh, refreshing }) => {
  console.log(tasks)
  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => <Text style={styles.taskItem}>{item.description}</Text>}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

// Main ToDo App component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch tasks from the server
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/task');
      console.log(response.data)
      setTasks(response.data); // Assuming the response has a tasks array
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Function to add a task
  const addTask = async (data) => {
    try {
      const task = {
        description: data
      }
      await axios.post('http://localhost:8080/api/task',task);
      fetchTasks(); // Refresh the task list after adding a new task
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  // Function to refresh the task list
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks().then(() => setRefreshing(false));
  }, [fetchTasks]);

  return (
    <View style={styles.container}>
      <AddNewTask onAddTask={addTask} />
      <TaskList tasks={tasks} onRefresh={onRefresh} refreshing={refreshing} />
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  addTaskContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  taskItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

// Export the main component
export default App;
