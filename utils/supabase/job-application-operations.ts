import supabase from './client';
import { JobApplication, User } from './types';

export const jobApplicationOperations = {
  async createJobApplication(jobId: string, sellerId: string): Promise<JobApplication | null> {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        seller_id: sellerId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job application:', error);
      return null;
    }

    return data;
  },

  async getUserJobApplications(userId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('seller_id', userId);

    if (error) {
      console.error('Error fetching user job applications:', error);
      return [];
    }

    return data;
  },

  async hasAppliedToJob(jobId: string, sellerId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('seller_id', sellerId)
      .single();

    if (error) {
      console.error('Error checking job application:', error);
      return false;
    }

    return !!data;
  },

  async getJobApplicationsWithSellers(jobId: string): Promise<Array<JobApplication & { seller: User }>> {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        seller:users!job_applications_seller_id_fkey (
          *
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });


    if (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
    console.log('HERE is the data', data);
    return data;
  }
}; 