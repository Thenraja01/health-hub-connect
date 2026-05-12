import React, { useEffect, useState } from 'react';
import { ListChecks, Calendar, CheckCircle2, Clock, AlertCircle, Plus, X, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchTasks, createTask } from '../../store/slices/dataSlice';
import { toast } from "sonner";

export default function DoctorTasks() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.data);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium",
    due: ""
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createTask(newTask)).unwrap();
      toast.success("Task added successfully");
      setShowAddForm(false);
      setNewTask({ title: "", priority: "Medium", due: "" });
    } catch (error: any) {
      toast.error(error || "Failed to add task");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Today's Tasks</h1>
          <p className="text-muted-foreground">Keep track of your clinical and administrative duties.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-gradient-primary text-white rounded-xl shadow-glow">
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      {showAddForm && (
        <div className="glass rounded-3xl p-8 border border-primary/20 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Create New Task</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Task Title</label>
              <Input 
                placeholder="e.g. Call Patient #102"
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="rounded-xl glass border-border/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Due Time</label>
              <Input 
                type="time"
                value={newTask.due} 
                onChange={(e) => setNewTask({...newTask, due: e.target.value})}
                className="rounded-xl glass border-border/40"
              />
            </div>
            <Button type="submit" className="bg-primary text-white rounded-xl h-11 font-bold shadow-glow">
              <Save className="h-4 w-4 mr-2" /> SAVE TASK
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-8">
        <div className="space-y-4">
          {tasks.length > 0 ? tasks.map((t: any, i: number) => (
            <div key={i} className={`glass rounded-3xl p-6 shadow-soft border-l-4 transition-all hover:translate-x-1 ${t.status === 'completed' ? 'border-l-success opacity-70' : 'border-l-primary'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${t.status === 'completed' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                    {t.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${t.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{t.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{t.patient || 'General'} · Due {t.due}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${t.priority === 'High' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                  {t.priority}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 glass rounded-3xl border border-dashed border-border/40">
              <ListChecks className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground italic text-sm">No tasks for today. Take a break!</p>
            </div>
          )}
        </div>

        <div className="glass rounded-[2rem] p-8 shadow-soft h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Daily Planner
          </h2>
          <div className="space-y-6">
            <div className="relative pl-6 border-l border-border">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <p className="text-xs font-bold text-primary uppercase">Current</p>
              <p className="text-sm font-semibold">Standard Working Hours</p>
              <p className="text-xs text-muted-foreground">Active for Consultations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

