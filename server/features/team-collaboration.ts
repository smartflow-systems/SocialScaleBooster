/**
 * TEAM COLLABORATION FEATURES
 * Multi-user access, roles, permissions, approval workflows, content calendar
 */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'creator' | 'viewer';
  permissions: Permission[];
  joinedAt: Date;
}

export type Permission =
  | 'create_content'
  | 'edit_content'
  | 'delete_content'
  | 'publish_content'
  | 'manage_team'
  | 'view_analytics'
  | 'manage_settings'
  | 'approve_content';

export interface ContentApproval {
  id: string;
  contentId: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_changes';
  reviewedBy?: string;
  comments?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

export class TeamCollaboration {
  private members: Map<string, TeamMember> = new Map();
  private approvals: Map<string, ContentApproval> = new Map();

  /**
   * Add team member
   */
  async addMember(params: {
    name: string;
    email: string;
    role: TeamMember['role'];
  }): Promise<TeamMember> {
    const permissions = this.getRolePermissions(params.role);

    const member: TeamMember = {
      id: 'member_' + Date.now(),
      name: params.name,
      email: params.email,
      role: params.role,
      permissions,
      joinedAt: new Date(),
    };

    this.members.set(member.id, member);

    return member;
  }

  /**
   * Update member role
   */
  async updateRole(memberId: string, newRole: TeamMember['role']): Promise<TeamMember> {
    const member = this.members.get(memberId);
    if (!member) throw new Error('Member not found');

    member.role = newRole;
    member.permissions = this.getRolePermissions(newRole);

    return member;
  }

  /**
   * Submit content for approval
   */
  async submitForApproval(params: {
    contentId: string;
    submittedBy: string;
  }): Promise<ContentApproval> {
    const approval: ContentApproval = {
      id: 'approval_' + Date.now(),
      contentId: params.contentId,
      submittedBy: params.submittedBy,
      status: 'pending',
      submittedAt: new Date(),
    };

    this.approvals.set(approval.id, approval);

    // Notify approvers
    const approvers = this.getApprovers();
    console.log(`Notifying ${approvers.length} approvers about new content submission`);

    return approval;
  }

  /**
   * Review content
   */
  async reviewContent(params: {
    approvalId: string;
    reviewedBy: string;
    action: 'approve' | 'reject' | 'request_changes';
    comments?: string;
  }): Promise<ContentApproval> {
    const approval = this.approvals.get(params.approvalId);
    if (!approval) throw new Error('Approval not found');

    approval.status =
      params.action === 'approve'
        ? 'approved'
        : params.action === 'reject'
        ? 'rejected'
        : 'needs_changes';
    approval.reviewedBy = params.reviewedBy;
    approval.comments = params.comments;
    approval.reviewedAt = new Date();

    return approval;
  }

  /**
   * Get pending approvals
   */
  getPendingApprovals(): ContentApproval[] {
    return Array.from(this.approvals.values()).filter(a => a.status === 'pending');
  }

  /**
   * Check permission
   */
  hasPermission(memberId: string, permission: Permission): boolean {
    const member = this.members.get(memberId);
    if (!member) return false;

    return member.permissions.includes(permission);
  }

  /**
   * Get team activity log
   */
  async getActivityLog(days: number = 30): Promise<any[]> {
    return [
      {
        timestamp: new Date(),
        member: 'John Doe',
        action: 'created_post',
        details: 'Instagram post "Summer Sale 2025"',
      },
      {
        timestamp: new Date(Date.now() - 3600000),
        member: 'Jane Smith',
        action: 'approved_content',
        details: 'Approved TikTok video for publishing',
      },
      {
        timestamp: new Date(Date.now() - 7200000),
        member: 'Mike Johnson',
        action: 'edited_bot',
        details: 'Updated bot settings for Facebook page',
      },
    ];
  }

  /**
   * Team performance dashboard
   */
  async getTeamPerformance(): Promise<any> {
    return {
      overview: {
        totalMembers: this.members.size,
        activeMembers: Math.floor(this.members.size * 0.8),
        totalPosts: 245,
        totalEngagement: 15420,
      },
      memberStats: Array.from(this.members.values()).map(member => ({
        name: member.name,
        role: member.role,
        postsCreated: Math.floor(Math.random() * 50) + 10,
        avgEngagement: (Math.random() * 5 + 2).toFixed(2) + '%',
        lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      })),
      topPerformers: [
        { name: 'Jane Smith', posts: 45, engagement: '5.2%' },
        { name: 'John Doe', posts: 38, engagement: '4.8%' },
      ],
    };
  }

  // Private helper methods

  private getRolePermissions(role: TeamMember['role']): Permission[] {
    const rolePermissions: Record<TeamMember['role'], Permission[]> = {
      owner: [
        'create_content',
        'edit_content',
        'delete_content',
        'publish_content',
        'manage_team',
        'view_analytics',
        'manage_settings',
        'approve_content',
      ],
      admin: [
        'create_content',
        'edit_content',
        'delete_content',
        'publish_content',
        'manage_team',
        'view_analytics',
        'approve_content',
      ],
      manager: [
        'create_content',
        'edit_content',
        'publish_content',
        'view_analytics',
        'approve_content',
      ],
      creator: ['create_content', 'edit_content', 'view_analytics'],
      viewer: ['view_analytics'],
    };

    return rolePermissions[role];
  }

  private getApprovers(): TeamMember[] {
    return Array.from(this.members.values()).filter(m =>
      m.permissions.includes('approve_content')
    );
  }
}

/**
 * Content Calendar Management
 */
export class ContentCalendar {
  /**
   * Get calendar view
   */
  async getCalendar(month: number, year: number): Promise<any> {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const posts = this.getScheduledPosts(date);

      calendar.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        posts: posts.length,
        content: posts,
      });
    }

    return {
      month,
      year,
      totalPosts: calendar.reduce((sum, day) => sum + day.posts, 0),
      calendar,
    };
  }

  /**
   * Schedule post
   */
  async schedulePost(params: {
    content: string;
    platform: string;
    scheduledFor: Date;
    createdBy: string;
  }): Promise<any> {
    return {
      postId: 'post_' + Date.now(),
      ...params,
      status: 'scheduled',
    };
  }

  /**
   * Drag and drop reschedule
   */
  async reschedulePost(postId: string, newDate: Date): Promise<any> {
    return {
      postId,
      oldDate: new Date(),
      newDate,
      updated: true,
    };
  }

  private getScheduledPosts(date: Date): any[] {
    // Mock data - in production, query from database
    return [
      {
        postId: 'post_1',
        platform: 'instagram',
        time: '9:00 AM',
        content: 'Summer sale announcement',
        status: 'scheduled',
      },
    ];
  }
}

export const teamCollaboration = new TeamCollaboration();
export const contentCalendar = new ContentCalendar();
